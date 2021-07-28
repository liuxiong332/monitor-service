#!/usr/bin/env python
import pika, sys, os

def main():
    credentials = pika.PlainCredentials('customer', '123456')
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='106.15.195.22', port=5672, credentials=credentials))
    channel = connection.channel()

    # channel.queue_declare(queue='f3265449-e300-47f2-b83b-2021052401470')

    def callback(ch, method, properties, body):
        # print(" [x] Received %r" % body.decode('utf8'))
        msg = body.decode('utf8')
        if 'alarmId' in msg:
            print(" [x] Received %r" % body.decode('utf8'))


    channel.basic_consume(queue='f3265449-e300-47f2-b83b-2021052401470', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)