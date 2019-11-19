CREATE TABLE weather(id SERIAL PRIMARY KEY, timestamp TEXT NOT NULL, timestamp_received TEXT NOT NULL,
					mac TEXT NOT NULL, temp TEXT, hum TEXT, ds18b20 TEXT );
