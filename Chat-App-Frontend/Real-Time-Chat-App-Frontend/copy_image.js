import fs from 'fs';
import path from 'path';

const src = 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\5dfc6184-c374-41af-97d0-9bf995d5be7e\\hero_person_chat_illustration_1787249975572.png';
const dest = 'E:\\JavaFullStackProject\\Real-Time-Chat-App-Frontend\\public\\hero_person.png';

fs.copyFileSync(src, dest);
console.log('Image copied successfully to public/hero_person.png');
