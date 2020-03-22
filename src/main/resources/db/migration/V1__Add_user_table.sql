create table monitor_user (
	user_id int not null auto_increment primary key,
    name varchar(32) default null,
    email varchar(1024) default null,
    password varchar(1024) default null,
    create_time datetime default null,
    update_time datetime default null
);