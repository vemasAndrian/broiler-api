CREATE TABLE proses_item (
    id int AUTO_INCREMENT PRIMARY KEY,
    proses_id int NOT NULL,
    nama VARCHAR(60) NOT NULL,
    pack int NOT NULL,
    qty int NOT NULL,
    harga int NOT NULL,
    CONSTRAINT fk_proses FOREIGN KEY (proses_id) REFERENCES proses(id)
);