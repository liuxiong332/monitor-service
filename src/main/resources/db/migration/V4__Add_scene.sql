CREATE TABLE monitor_scene(
	scene_id int not null auto_increment primary key,
    name varchar(32) default null,
    description varchar(1024) default null,
    create_time datetime default null,
    update_time datetime default null
);
