const cloud = require('wx-server-sdk');
const Jimp = require('jimp');
const dayjs = require('dayjs');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { userName = 'Learner', courseName = 'LeanClaw Master', date = new Date() } = event;

  try {
    // 1. Create a blank image (A4 landscape ratio roughly: 842x595 -> let's use 1000x700)
    const width = 1000;
    const height = 700;
    const image = new Jimp(width, height, '#FFFFFF');

    // 2. Draw border
    const borderPadding = 40;
    const innerRect = {
      x: borderPadding,
      y: borderPadding,
      w: width - (borderPadding * 2),
      h: height - (borderPadding * 2)
    };
    
    // Draw a thick blue border
    // Jimp doesn't have drawRect with thickness easily, so loop or scan
    // A simpler way: composite a color block? No.
    // Let's just draw lines by setting pixels or scan iterator?
    // Actually, easier to load fonts first.

    // Load fonts
    const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK); // Title
    const fontText = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); // Normal text
    const fontName = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK); // Name
    
    // Helper to center text
    const printCenter = (font, text, y) => {
      const textWidth = Jimp.measureText(font, text);
      const x = (width - textWidth) / 2;
      image.print(font, x, y, text);
    };

    // 3. Draw Content
    
    // Border Logic (Simple visual frame)
    // Draw top/bottom bars
    for(let x=0; x<width; x++) {
      for(let y=0; y<20; y++) {
        image.setPixelColor(Jimp.cssColorToHex('#1a4a6e'), x, y); // Top bar
        image.setPixelColor(Jimp.cssColorToHex('#1a4a6e'), x, height - 1 - y); // Bottom bar
      }
    }
    
    // Draw Title
    printCenter(fontTitle, 'CERTIFICATE OF COMPLETION', 100);

    // Draw "This certifies that"
    printCenter(fontText, 'This certifies that', 200);

    // Draw Name
    printCenter(fontName, userName, 260);

    // Draw "has successfully completed"
    printCenter(fontText, 'has successfully completed the course', 360);

    // Draw Course Name
    printCenter(fontTitle, courseName, 420);

    // Draw Date
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    image.print(fontText, 100, 550, `Date: ${dateStr}`);

    // Draw Signature placeholder
    const sigText = 'LeanClaw Team';
    const sigWidth = Jimp.measureText(fontText, sigText);
    image.print(fontText, width - sigWidth - 100, 550, sigText);

    // 4. Get Buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    // 5. Upload to Cloud Storage
    const fileName = `certificates/${OPENID}_${Date.now()}.png`;
    const uploadRes = await cloud.uploadFile({
      cloudPath: fileName,
      fileContent: buffer,
    });

    // 6. Save Record to DB
    await db.collection('certificates').add({
      data: {
        _openid: OPENID,
        userId: OPENID,
        userName,
        courseName,
        completionDate: new Date(),
        fileId: uploadRes.fileID,
        createdAt: db.serverDate()
      }
    });

    return {
      success: true,
      fileId: uploadRes.fileID,
      message: 'Certificate generated successfully'
    };

  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err.message
    };
  }
};
