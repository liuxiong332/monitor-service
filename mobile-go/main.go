package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
	"time"

	"github.com/google/uuid"
	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

type AlarmSaver struct {
	savePath, filePath string
}

func NewAlarmSaver() AlarmSaver {
	savePath := os.Getenv("ALARM_PATH")
	if savePath == "" {
		savePath = "/opt/car_video/alarm/"
	}
	filePath := os.Getenv("FILE_PATH")
	if filePath == "" {
		filePath = "/opt/car_video/files/"
	}
	log.Printf("Will run with %s", savePath)
	return AlarmSaver{
		savePath: savePath,
		filePath: filePath,
	}
}

func (saver AlarmSaver) saveAlarm(alarmInfo map[string]interface{}) {
	if alarmInfo["proofList"] == nil {
		return
	}
	proofList := alarmInfo["proofList"].([]string)
	mediaList := make([]string, 0)
	for _, proof := range proofList {
		resp, err := http.Get(proof)

		urlInfo, parseErr := url.Parse(proof)
		if err == nil && parseErr == nil {
			defer resp.Body.Close()

			body, readErr := ioutil.ReadAll(resp.Body)

			if readErr == nil {
				fileId, err := uuid.NewUUID()
				failOnError(err, "UUID error")

				mediaName := fmt.Sprintf("%s%s", fileId, path.Ext(urlInfo.Path))

				ioutil.WriteFile(path.Join(saver.filePath, mediaName), body, 0644)
				mediaList = append(mediaList, mediaName)
			}
		}
	}

	alarmInfo["proofList"] = mediaList

	dateStr := time.Now().Format("20060102150405")
	alarmType := alarmInfo["alarmType"].(int)
	devidno := alarmInfo["devidno"]

	fileName := fmt.Sprintf("%s_%d_%s.json", devidno, alarmType, dateStr)

	byteInfo, err := json.MarshalIndent(alarmInfo, "", "  ")
	failOnError(err, "Marshal error")

	ioutil.WriteFile(path.Join(saver.savePath, fileName), byteInfo, 0666)
}

type MessageReceiver struct {
	alarmItems map[string]map[string]interface{}
	msgChan    chan map[string]interface{}
	timeChan   chan string
	saver      AlarmSaver
}

func NewReceiver() MessageReceiver {
	return MessageReceiver{
		alarmItems: make(map[string]map[string]interface{}),
		msgChan:    make(chan map[string]interface{}),
		timeChan:   make(chan string),
		saver:      NewAlarmSaver(),
	}
}

func (receiver *MessageReceiver) startTimer(alarmId string) {
	go func() {
		timer := time.NewTimer(time.Minute * 2)
		<-timer.C
		receiver.timeChan <- alarmId
	}()
}

func (receiver *MessageReceiver) process() {
	go func() {
		for {
			select {
			case msg := <-receiver.msgChan:
				alarmId := msg["alarmId"].(string)
				if msg["msgId"] == "0200" {
					receiver.alarmItems[alarmId] = msg
				} else if msg["msgId"] == "0801" && receiver.alarmItems[alarmId] != nil {
					alarmItem := receiver.alarmItems[alarmId]

					if alarmItem["proofList"] == nil {
						alarmItem["proofList"] = make([]string, 1)
					}
					alarmItem["proofList"] = append(alarmItem["proofList"].([]string), msg["mediaUrl"].(string))
					log.Printf("Receive Proof List: %v", alarmItem["proofList"])
				}

			case alarmId := <-receiver.timeChan:
				log.Printf("Receive Alarm: %v", receiver.alarmItems[alarmId])
				receiver.saver.saveAlarm(receiver.alarmItems[alarmId])
				delete(receiver.alarmItems, alarmId)
			}
		}
	}()
}

func (receiver *MessageReceiver) recvMsg(msg map[string]interface{}) {
	if msg["alarmId"] != nil {
		log.Printf("Receive message: %v", msg)
		alarmId := msg["alarmId"].(string)
		if msg["msgId"] == "0200" {
			// receiver.alarmItems[alarmId] = msg
			receiver.msgChan <- msg
			log.Printf("Send alarm")
			receiver.startTimer(alarmId)
		} else if msg["msgId"] == "0801" {
			receiver.msgChan <- msg
		}
	}
}

func (receiver *MessageReceiver) Start() {
	conn, err := amqp.Dial("amqp://customer:123456@106.15.195.22:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	msgs, err := ch.Consume(
		"f3265449-e300-47f2-b83b-2021052401470", // queue
		"",                                      // consumer
		true,                                    // auto-ack
		false,                                   // exclusive
		false,                                   // no-local
		true,                                    // no-wait
		nil,                                     // args
	)
	failOnError(err, "Failed to register a consumer")

	receiver.process()

	go func() {
		for d := range msgs {
			var msg map[string]interface{}
			err := json.Unmarshal(d.Body, &msg)
			failOnError(err, "Not valid json")

			receiver.recvMsg(msg)
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")

	forever := make(chan bool)
	<-forever
}

func main() {

	receiver := NewReceiver()
	receiver.Start()
}
