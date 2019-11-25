# Docs: Database Guide
The purpose of this readme is to outline the IFS **field_science** database, and describe the tables which are used in processing Fieldday information. The database is hosted on the Earlham College cluster, using postgreSQL.

## Tables
the **field_science** database contains the following tables which are necissary for the datavis tool to function. If the tables in your database are different, then the **queries.js** file will need to be tweaked to accomodate your data.

This section also includes an example for each table, showing how data might be aquired from the database.
### *fieldday_platform*
| column | type | example |
|---|---|---|
| platformid | char(8) | "4ef" |
| platformtype | char(16) | "Ambiance" |
| platformname | char(16) | "Grace" |

### *fieldday_sensor*
| column | type | example |
|---|---|---|
| platformid | char(8) | "4ef" |
| sensorid | char(8) | "55a" |
| sensortype | char(30) | "Reletive Humidity" |
| sensorunits | char(8) | "%" |

### *fieldday_trip*
***example:*** `SELECT * FROM fieldday_trip;`

| column | type | example |
|---|---|---|
| tripid | int | 23 |
| tripname | char(128) | "Iceland 2016" |

### *fieldday_site*
***example:*** `SELECT * FROM fieldday_site WHERE tripid=23;`

| column | type | example |
|---|---|---|
| tripid | int | 23 |
| siteid | int | 24 |
| sitename | char(128) | "Pingvellir" |
| sitenotes | text | "Notes about site" |

### *fieldday_sector*
***example:*** `SELECT * FROM fieldday_sector WHERE tripid=23 AND siteid=2;`

| column | type | example |
|---|---|---|
| tripid | int | 23 |
| siteid | int | 24 |
| sectorid | int | 231 |
| sectorname | char(128) | "Pingvellir" |
| sectornotes | text | "Notes about sector" |

### *fieldday_spot*
***example:*** `SELECT * FROM fieldday_spot WHERE tripid=23 AND siteid=2 AND sectorid=1;`

| column | type | example |
|---|---|---|
| tripid | int | 23 |
| siteid | int | 24 |
| sectorid | int | 231 |
| spotid | int | 3 |
| spotiamgefolder | char(128) | dir_name |
| spotnotes | text | "Notes about sector" |

### *fieldday_streaming*
| column | type | example |
|---|---|---|
| tripid | int | 24 |
| siteid | int | 24 |
| sectorid | int | 231 |
| platformid | char(8) | "ev5" |
| sensorid | char(8) | "83a" |
| hostid | char(30) | "08f5b5cf" |
| recordtime | timestamp | 2019-04-30 15:08:05-04 |
| longitude | double | -84.91287 |
| latitude | double | 39.824677 |
| elevation | double | 246.8 |
| quality | double | 0 |
| accuracy | double | 11 |
| satellites | int | 8 |
| value_1 | numeric | 98758.67 |
| value_2 | numeric | 0.0 |
| value_3 | numeric | 0.0 |
| value_4 | numeric | 0.0 |
| value_5 | numeric | 0.0 |
| value_6 | numeric | 0.0 |

### *fieldday_reading*
| column | type | example |
|---|---|---|
| tripid | int | 24 |
| siteid | int | 24 |
| sectorid | int | 231 |
| spotid | int | 3 |
| platformid | char(8) | "ev5" |
| sensorid | char(8) | "83a" |
| hostid | char(30) | "08f5b5cf" |
| imagefilename | text | file_name |
| readingnotes | text | "reading notes" |
| recordtime | timestamp | 2019-04-30 15:08:05-04 |
| longitude | double | -84.91287 |
| latitude | double | 39.824677 |
| elevation | double | 246.8 |
| quality | double | 0 |
| accuracy | double | 11 |
| satellites | int | 8 |
| value | numeric | 98758.67 |
| value_2 | numeric | 0.0 |
| value_3 | numeric | 0.0 |
| value_4 | numeric | 0.0 |
| value_5 | numeric | 0.0 |
| value_6 | numeric | 0.0 |