CREATE TABLE event_counter(
	id int not null auto_increment primary key,
    event_day varchar(32) default null,
    counter int default 1,
    create_time datetime default null,
    update_time datetime default null,
    index event_day(event_day)
);
