#!/usr/bin/env python
import pika, sys, os, json

class MessageReceiver:
    def __init__(self) -> None:
        self.alarm_items = {}

    def main(self):
        credentials = pika.PlainCredentials('customer', '123456')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='106.15.195.22', port=5672, credentials=credentials))
        channel = connection.channel()

        # channel.queue_declare(queue='f3265449-e300-47f2-b83b-2021052401470')

        def callback(ch, method, properties, body):
            # print(" [x] Received %r" % body.decode('utf8'))
            msg = json.loads(body.decode('utf8'))
            if 'alarmId' in msg:
                print(" [x] Received %r" % body.decode('utf8'))

                alarm_id = msg['alarmId']
                if msg['msgId'] == '0200':
                    self.alarm_items[alarm_id] = msg
                elif msg['msgId'] == '0801':
                    if alarm_id not in self.alarm_items:
                        self.alarm_items[alarm_id] = {}
                    if 'proofList' not in self.alarm_items[alarm_id]:
                        self.alarm_items[alarm_id]['proofList'] = []
                    self.alarm_items[alarm_id]['proofList'].append(msg['mediaUrl'])

                    print("Get proof list {}".format(self.alarm_items[alarm_id]['proofList']))

        channel.basic_consume(queue='f3265449-e300-47f2-b83b-2021052401470', on_message_callback=callback, auto_ack=True)

        print(' [*] Waiting for messages. To exit press CTRL+C')
        channel.start_consuming()

if __name__ == '__main__':
    try:
        MessageReceiver().main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)