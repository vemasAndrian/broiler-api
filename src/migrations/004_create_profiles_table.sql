CREATE TABLE profiles (
    id int AUTO_INCREMENT PRIMARY KEY,
    user_id int NOT NULL,
    nama VARCHAR(60) NOT NULL NOT NULL,
    tgl_lahir DATE NOT NULL,
    tempat_lahir VARCHAR(60) NOT NULL,
    alamat TEXT NOT NULL,
    no_telp VARCHAR(15) NOT NULL,
    no_kendaraan VARCHAR(15) NOT NULL,
    avatar TEXT,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);