CREATE TABLE event_record(
	event_id VARCHAR(128) not null primary key,
    event_date TIMESTAMP default null,
    file_names VARCHAR(1024),
    device_id int,
    scene_id int,
    info VARCHAR(1024),
    index event_date(event_date)
);
