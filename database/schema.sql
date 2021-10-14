-- CREATE DATABASE

CREATE DATABASE IF NOT EXISTS infbotutils;
USE infbotutils;

-- CREATE TABLES

CREATE TABLE IF NOT EXISTS guilds (
    guildId VARCHAR(32) NOT NULL,
    welcomeChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    boostChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    auditChannelId VARCHAR(32) NOT NULL DEFAULT "None",
    reactionRolesId VARCHAR(32) NOT NULL DEFAULT "None",
    PRIMARY KEY (guildId)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS reactionRoles (
    channelId VARCHAR(32) NOT NULL,
    reactionsData JSON DEFAULT NULL,
    PRIMARY KEY (channelId)
) ENGINE=INNODB;

-- DELETE TABLES

DROP TABLE guilds;
DROP TABLE reactionRoles;

-- DESCRIBE TABLES

DESCRIBE guilds;
DESCRIBE reactionRoles;
