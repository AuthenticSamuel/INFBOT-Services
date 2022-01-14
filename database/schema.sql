-- CREATE DATABASE

CREATE DATABASE IF NOT EXISTS infbotutils;
USE infbotutils;

-- CREATE TABLES

CREATE TABLE IF NOT EXISTS guilds (
    guildId VARCHAR(32) NOT NULL,
    PRIMARY KEY (guildId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS reactionRoles (
    channelId VARCHAR(32) NOT NULL,
    reactionsData JSON DEFAULT NULL,
    PRIMARY KEY (channelId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS utils (
    guildId VARCHAR(32) NOT NULL,
    welcomeChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    boostChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    auditChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    reactionRolesId VARCHAR(32) NOT NULL DEFAULT "None",
    newMemberRoleId VARCHAR(32) NOT NULL DEFAULT "None",
    PRIMARY KEY (guildId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS voice (
    guildId VARCHAR(32) NOT NULL,
    channelCreator VARCHAR(32) NOT NULL DEFAULT "None",
    channelCreatorCategory VARCHAR(32) NOT NULL DEFAULT "None",
    PRIMARY KEY (guildId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS voiceChannels (
    id INT NOT NULL AUTO_INCREMENT,
    guildId VARCHAR(32) NOT NULL,
    channelId VARCHAR(32) NOT NULL,
    invitedUsersId TEXT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

-- DELETE TABLES

DROP TABLE guilds;
DROP TABLE reactionRoles;
DROP TABLE utils;
DROP TABLE voice;
DROP TABLE voiceChannels;

-- DESCRIBE TABLES

DESCRIBE guilds;
DESCRIBE reactionRoles;
DESCRIBE utils;
DESCRIBE voice;
DESCRIBE voiceChannels;
