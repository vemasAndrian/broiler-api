CREATE TABLE proses (
    id int AUTO_INCREMENT PRIMARY KEY,
    profile_id int NOT NULL,
    location_id int NOT NULL,
    customer VARCHAR(60) NOT NULL,
    tgl_penggiriman DATE NOT NULL,
    status VARCHAR(60) NOT NULL, 
    bukti_penggiriman TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    shipped_at TIMESTAMP,
    canceled_at TIMESTAMP,
    CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES profiles(id),
    CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES locations(id)
);