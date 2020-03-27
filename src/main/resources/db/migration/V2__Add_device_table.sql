create table monitor_device (
	device_id int not null auto_increment primary key,
    name varchar(1024) default null,
    password varchar(1024) default null,
    service_url varchar(1024) default null,
    device_type int default 0 NOT NULL,
    location varchar(1024) default null,
    create_time datetime default null,
    update_time datetime default null
);