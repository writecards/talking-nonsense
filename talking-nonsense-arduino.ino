unsigned long myTime;

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(57600);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
}

void loop() {
  // reads the input on analog pin A0 (value between 0 and 1023)
  int analogValue = analogRead(A0);
   Serial.println(analogValue);   // the raw analog reading

  digitalWrite(5, HIGH);

  digitalWrite(6, HIGH);


//  Serial.print("Analog reading = ");
 

  // We'll have a few threshholds, qualitatively determined


  delay(20);
}
