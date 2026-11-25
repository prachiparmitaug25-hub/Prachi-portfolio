import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateResume() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = height - 45;
  const margin = 48;
  const contentWidth = width - margin * 2;

  // Header: Name
  const name = 'PRACHI PARMITA';
  const nameSize = 22;
  const nameWidth = fontBold.widthOfTextAtSize(name, nameSize);
  page.drawText(name, {
    x: (width - nameWidth) / 2,
    y,
    size: nameSize,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 22;

  // Contact line
  const contactText = '+91 9717161464    |    Devli, New Delhi – 110080    |    prachiparmita11@gmail.com';
  const contactSize = 9.5;
  const contactWidth = fontRegular.widthOfTextAtSize(contactText, contactSize);
  page.drawText(contactText, {
    x: (width - contactWidth) / 2,
    y,
    size: contactSize,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 14;

  // Horizontal divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 20;

  function drawSectionHeader(title) {
    page.drawText(title, {
      x: margin,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });
    y -= 5;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.75,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 14;
  }

  function drawWrappedText(text, fontSize = 9, font = fontRegular, lineHeight = 12) {
    const words = text.split(' ');
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > contentWidth && currentLine.length > 0) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      page.drawText(currentLine, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineHeight;
    }
  }

  // ABOUT ME
  drawSectionHeader('ABOUT ME');
  drawWrappedText(
    'B.Tech Computer Science & Engineering student with experience leading teams in hackathons, framing problems, researching and pitching ideas, and organizing college events. Founder of IVAS, an intelligent vehicle accountability system. Currently learning Python, Git and AWS fundamentals, and looking for an internship to build hands-on technical skills.',
    9.2,
    fontRegular,
    13
  );

  y -= 10;

  // EDUCATION
  drawSectionHeader('EDUCATION');

  // Row 1
  page.drawText('Schooling', { x: margin, y, size: 9.5, font: fontBold });
  page.drawText('2025 – 2029', { x: width - margin - fontBold.widthOfTextAtSize('2025 – 2029', 9.5), y, size: 9.5, font: fontBold });
  y -= 13;

  page.drawText('New Green Field School, Saket, New Delhi', { x: margin, y, size: 9, font: fontRegular });
  const btechText = 'B.Tech – Computer Science & Engineering';
  page.drawText(btechText, { x: 300, y, size: 9, font: fontBold });
  y -= 13;

  page.drawText('Class XII: 70% | Class X: 87.85%', { x: margin, y, size: 9, font: fontRegular });
  page.drawText('IILM University, Gurugram | CGPA: 7.2 (First Year)', { x: 300, y, size: 9, font: fontRegular });
  y -= 20;

  // RELEVANT SKILLS
  drawSectionHeader('RELEVANT SKILLS');
  const col1X = margin + 10;
  const col2X = margin + 175;
  const col3X = margin + 345;

  const skills1 = ['• Public Speaking', '• Communication Skills', '• Research & Problem Framing'];
  const skills2 = ['• Pitching & Presentation Design', '• Team Leadership', '• Event Management'];
  const skills3 = ['• Social Media Management', '• Python (learning)', '• Git & AWS (learning)'];

  const skillsStartY = y;
  for (let i = 0; i < 3; i++) {
    page.drawText(skills1[i], { x: col1X, y: skillsStartY - i * 13, size: 9, font: fontRegular });
    page.drawText(skills2[i], { x: col2X, y: skillsStartY - i * 13, size: 9, font: fontRegular });
    page.drawText(skills3[i], { x: col3X, y: skillsStartY - i * 13, size: 9, font: fontRegular });
  }
  y = skillsStartY - 3 * 13 - 10;

  // PROJECTS
  drawSectionHeader('PROJECTS');
  
  // Project 1: IVAS
  page.drawText('IVAS – Intelligent Vehicle Accountability System', { x: margin, y, size: 9.5, font: fontBold });
  const role1 = 'Founder & Project Lead';
  page.drawText(role1, { x: width - margin - fontOblique.widthOfTextAtSize(role1, 9), y, size: 9, font: fontOblique });
  y -= 13;

  drawWrappedText(
    'Designed a vehicle-mounted system that records only key events (speed anomalies, harsh braking, collisions, fatigue risk) and cryptographically seals each one when recorded, so data cannot be silently altered. Built to give insurers, investigators and courts a reliable record. Wrote the project report and pitched it at Innovate X.',
    8.8,
    fontRegular,
    12
  );
  y -= 6;

  // Project 2: Presentation to Swarna Jayanti
  page.drawText('Presentation to Swarna Jayanti Representatives', { x: margin, y, size: 9.5, font: fontBold });
  const role2 = 'Team Member';
  page.drawText(role2, { x: width - margin - fontOblique.widthOfTextAtSize(role2, 9), y, size: 9, font: fontOblique });
  y -= 13;
  drawWrappedText('Presented Anganwadi Connect.', 8.8, fontRegular, 12);
  y -= 10;

  // HACKATHONS
  drawSectionHeader('HACKATHONS');

  // SIH 2025
  page.drawText('Smart India Hackathon 2025', { x: margin, y, size: 9.5, font: fontBold });
  const hRole1 = 'Team Leader';
  page.drawText(hRole1, { x: width - margin - fontOblique.widthOfTextAtSize(hRole1, 9), y, size: 9, font: fontOblique });
  y -= 13;
  drawWrappedText('Led the team on an AI-powered smart calendar for the Government of Jharkhand; handled problem framing, research and pitch.', 8.8, fontRegular, 12);
  y -= 6;

  // Innovate X
  page.drawText('Innovate X', { x: margin, y, size: 9.5, font: fontBold });
  page.drawText('Team Leader', { x: width - margin - fontOblique.widthOfTextAtSize('Team Leader', 9), y, size: 9, font: fontOblique });
  y -= 13;
  drawWrappedText('Led the team and pitched IVAS.', 8.8, fontRegular, 12);
  y -= 6;

  // SIH 2026
  page.drawText('Smart India Hackathon 2026', { x: margin, y, size: 9.5, font: fontBold });
  page.drawText('Team Member', { x: width - margin - fontOblique.widthOfTextAtSize('Team Member', 9), y, size: 9, font: fontOblique });
  y -= 13;
  drawWrappedText('SnapCheck, an AI-based platform that checks packaged products against legal declaration requirements using OCR and a rule engine.', 8.8, fontRegular, 12);
  y -= 6;

  // Appathon
  page.drawText('Appathon', { x: margin, y, size: 9.5, font: fontBold });
  page.drawText('Team Member', { x: width - margin - fontOblique.widthOfTextAtSize('Team Member', 9), y, size: 9, font: fontOblique });
  y -= 13;
  drawWrappedText("Contributed to FloatChat, the team's app.", 8.8, fontRegular, 12);
  y -= 12;

  // LEADERSHIP & ACTIVITIES
  drawSectionHeader('LEADERSHIP & ACTIVITIES');
  const activities = [
    '• Event Head, Cultural Club: organized large-scale, campus-wide events.',
    '• Social Media Head, Public Speaking Club; active public speaker and communicator.',
    '• Member: IEEE Student Society and Under 25 Society.',
    '• Member: Student Industry Connect Team (SICT).'
  ];

  for (let act of activities) {
    page.drawText(act, { x: margin + 5, y, size: 9, font: fontRegular });
    y -= 13;
  }

  const pdfBytes = await pdfDoc.save();

  // Save to root directory
  fs.writeFileSync(path.resolve('./Prachi_Parmita_Resume.pdf'), pdfBytes);

  // Also save to public directory if it exists, or create it
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
  }
  fs.writeFileSync(path.resolve('./public/Prachi_Parmita_Resume.pdf'), pdfBytes);

  console.log('Successfully generated Prachi_Parmita_Resume.pdf in ./ and ./public/');
}

generateResume().catch(console.error);
