CREATE TABLE message (
    id SERIAL  PRIMARY KEY,
    sender_Id INT NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(225) NOT null,
    date TIMESTAMP NOT NULL,
    receiver_Id INT,
    room_name VARCHAR(225),
    room_id VARCHAR(225) 
  )

