import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.userProgress.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.node.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.roadmap.deleteMany();

  const roadmap = await prisma.roadmap.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Hành trình chinh phục JavaScript từ nền tảng đến ứng dụng thực tế",
    },
  });

  const chapter1 = await prisma.chapter.create({
    data: {
      roadmapId: roadmap.id,
      title: "Nền Tảng",
      orderIndex: 1,
      nebulaColor: "#3b82f6",
    },
  });

  const chapter2 = await prisma.chapter.create({
    data: {
      roadmapId: roadmap.id,
      title: "Hàm & Cấu Trúc",
      orderIndex: 2,
      nebulaColor: "#8b5cf6",
    },
  });

  const chapter3 = await prisma.chapter.create({
    data: {
      roadmapId: roadmap.id,
      title: "Ứng Dụng Thực Tế",
      orderIndex: 3,
      nebulaColor: "#10b981",
    },
  });

  // Chapter 1 nodes — layout horizontal, top zone
  const node1 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter1.id,
      title: "Biến & Kiểu Dữ Liệu",
      orderIndex: 1,
      posX: 400,
      posY: 150,
    },
  });

  const node2 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter1.id,
      title: "Điều Kiện",
      orderIndex: 2,
      posX: 600,
      posY: 250,
      prerequisiteNodeId: node1.id,
    },
  });

  const node3 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter1.id,
      title: "Vòng Lặp",
      orderIndex: 3,
      posX: 800,
      posY: 150,
      prerequisiteNodeId: node2.id,
    },
  });

  // Chapter 2 nodes — middle zone
  const node4 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter2.id,
      title: "Hàm (Functions)",
      orderIndex: 4,
      posX: 400,
      posY: 420,
      prerequisiteNodeId: node3.id,
    },
  });

  const node5 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter2.id,
      title: "Array & Object",
      orderIndex: 5,
      posX: 600,
      posY: 520,
      prerequisiteNodeId: node4.id,
    },
  });

  const node6 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter2.id,
      title: "Xử Lý Lỗi",
      orderIndex: 6,
      posX: 800,
      posY: 420,
      prerequisiteNodeId: node5.id,
    },
  });

  const node7 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter2.id,
      title: "Async / Await",
      orderIndex: 7,
      posX: 1000,
      posY: 520,
      prerequisiteNodeId: node6.id,
    },
  });

  // Chapter 3 nodes — bottom zone
  const node8 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter3.id,
      title: "DOM Manipulation",
      orderIndex: 8,
      posX: 400,
      posY: 750,
      prerequisiteNodeId: node7.id,
    },
  });

  const node9 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter3.id,
      title: "Fetch API",
      orderIndex: 9,
      posX: 650,
      posY: 850,
      prerequisiteNodeId: node8.id,
    },
  });

  const node10 = await prisma.node.create({
    data: {
      roadmapId: roadmap.id,
      chapterId: chapter3.id,
      title: "Module & Import/Export",
      orderIndex: 10,
      posX: 900,
      posY: 750,
      prerequisiteNodeId: node9.id,
    },
  });

  // Missions for each node
  const missions = [
    {
      nodeId: node1.id,
      description: `# Ải 1 — Biến & Kiểu Dữ Liệu\n\nKhai báo một biến tên \`playerName\` bằng \`let\`, gán giá trị là tên của bạn (chuỗi).\n\nSau đó khai báo một hằng số \`MAX_LEVEL\` bằng \`const\` với giá trị là \`100\`.\n\nIn ra console cả hai biến.\n\n**Ví dụ output:**\n\`\`\`\nNguyen Van A\n100\n\`\`\``,
      initialCode: `// Khai báo biến playerName\n\n// Khai báo hằng số MAX_LEVEL\n\n// In ra console\n`,
      solutionHint: "Dùng let cho biến có thể thay đổi, const cho hằng số.",
      validationPattern: "let\\s+playerName|const\\s+MAX_LEVEL|console\\.log",
    },
    {
      nodeId: node2.id,
      description: `# Ải 2 — Điều Kiện\n\nViết một hàm \`checkLevel(level)\` nhận vào một số nguyên.\n\n- Nếu level >= 50: trả về \`"Veteran"\`\n- Nếu level >= 20: trả về \`"Adventurer"\`  \n- Ngược lại: trả về \`"Novice"\`\n\n**Ví dụ:**\n\`checkLevel(55)\` → \`"Veteran"\`\n\`checkLevel(25)\` → \`"Adventurer"\`\n\`checkLevel(5)\` → \`"Novice"\``,
      initialCode: `function checkLevel(level) {\n  // Viết logic tại đây\n}\n\nconsole.log(checkLevel(55));\nconsole.log(checkLevel(25));\nconsole.log(checkLevel(5));\n`,
      solutionHint: "Dùng if / else if / else để kiểm tra các điều kiện.",
      validationPattern: "if|else\\s+if|else|return",
    },
    {
      nodeId: node3.id,
      description: `# Ải 3 — Vòng Lặp\n\nViết code in ra các số từ 1 đến 10, nhưng:\n- Nếu số chia hết cho 3: in \`"Fizz"\`\n- Nếu số chia hết cho 5: in \`"Buzz"\`\n- Nếu chia hết cho cả 3 và 5: in \`"FizzBuzz"\`\n- Còn lại: in số đó\n\n**Ví dụ output:**\n\`1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz\``,
      initialCode: `for (let i = 1; i <= 10; i++) {\n  // Viết logic FizzBuzz\n}\n`,
      solutionHint: "Kiểm tra i % 3 === 0 và i % 5 === 0. Hãy kiểm tra FizzBuzz trước.",
      validationPattern: "for|while|FizzBuzz|Fizz|Buzz",
    },
    {
      nodeId: node4.id,
      description: `# Ải 4 — Hàm (Functions)\n\nViết một hàm \`calculateDamage(baseDamage, multiplier = 1)\` tính sát thương trong game.\n\n- Tham số \`multiplier\` có giá trị mặc định là 1\n- Trả về \`baseDamage * multiplier\`\n- Nếu kết quả > 100, trả về 100 (damage cap)\n\n**Ví dụ:**\n\`calculateDamage(30, 2)\` → \`60\`\n\`calculateDamage(80, 2)\` → \`100\`\n\`calculateDamage(40)\` → \`40\``,
      initialCode: `function calculateDamage(baseDamage, multiplier = 1) {\n  // Viết logic tại đây\n}\n\nconsole.log(calculateDamage(30, 2));\nconsole.log(calculateDamage(80, 2));\nconsole.log(calculateDamage(40));\n`,
      solutionHint: "Dùng Math.min() để giới hạn giá trị tối đa.",
      validationPattern: "function\\s+calculateDamage|=>|return|Math\\.min",
    },
    {
      nodeId: node5.id,
      description: `# Ải 5 — Array & Object\n\nTạo một mảng \`inventory\` chứa 3 object item, mỗi item có:\n- \`name\`: tên vật phẩm\n- \`quantity\`: số lượng\n\nSau đó dùng \`Array.map()\` để tạo mảng mới chứa chỉ tên các item.\n\n**Ví dụ:**\n\`["Sword", "Shield", "Potion"]\``,
      initialCode: `const inventory = [\n  // Thêm 3 item vào đây\n];\n\n// Dùng .map() để lấy danh sách tên\nconst itemNames = inventory.map(/* ... */);\n\nconsole.log(itemNames);\n`,
      solutionHint: "Mỗi item là một object { name: '...', quantity: ... }. Dùng item.name trong map().",
      validationPattern: "\\.map\\(|=>|\\{.*name|inventory",
    },
    {
      nodeId: node6.id,
      description: `# Ải 6 — Xử Lý Lỗi\n\nViết hàm \`parseJSON(str)\` an toàn:\n- Dùng \`try/catch\` để parse chuỗi JSON\n- Nếu thành công: trả về object đã parse\n- Nếu lỗi: trả về \`null\` và log \`"Invalid JSON: <error message>"\`\n\n**Ví dụ:**\n\`parseJSON('{"hp": 100}')\` → \`{ hp: 100 }\`\n\`parseJSON('not json')\` → \`null\``,
      initialCode: `function parseJSON(str) {\n  // Viết try/catch tại đây\n}\n\nconsole.log(parseJSON('{"hp": 100}'));\nconsole.log(parseJSON('not json'));\n`,
      solutionHint: "Dùng JSON.parse() bên trong try block. Catch nhận tham số error.",
      validationPattern: "try|catch|JSON\\.parse|return null",
    },
    {
      nodeId: node7.id,
      description: `# Ải 7 — Async / Await\n\nViết một async function \`fetchPlayerData(playerId)\` mô phỏng việc lấy dữ liệu:\n- Dùng \`await new Promise(resolve => setTimeout(resolve, 1000))\` để giả lập delay\n- Trả về object \`{ id: playerId, name: "Hero_" + playerId, level: 42 }\`\n\nGọi hàm và in kết quả ra console.\n\n**Lưu ý:** Hàm async trả về Promise.`,
      initialCode: `async function fetchPlayerData(playerId) {\n  // Giả lập network delay\n  \n  // Trả về data\n}\n\n// Gọi hàm và in kết quả\nfetchPlayerData(1).then(console.log);\n`,
      solutionHint: "async/await là cú pháp sugar cho Promise. Dùng await trước bất kỳ Promise nào.",
      validationPattern: "async|await|Promise|setTimeout",
    },
    {
      nodeId: node8.id,
      description: `# Ải 8 — DOM Manipulation\n\nViết hàm \`createPlayerCard(player)\` nhận object player \`{ name, level }\` và:\n1. Tạo \`<div>\` với class \`player-card\`\n2. Tạo \`<h2>\` chứa tên player\n3. Tạo \`<p>\` chứa "Level: " + level\n4. Append cả hai vào div\n5. Trả về div đó\n\n**Không cần append vào document**, chỉ cần trả về element.`,
      initialCode: `function createPlayerCard(player) {\n  const card = document.createElement('div');\n  // Thêm class và nội dung\n  \n  return card;\n}\n\nconst card = createPlayerCard({ name: "Nguyen", level: 42 });\nconsole.log(card.innerHTML);\n`,
      solutionHint: "Dùng createElement, classList.add, textContent, và appendChild.",
      validationPattern: "createElement|appendChild|classList|textContent|innerHTML",
    },
    {
      nodeId: node9.id,
      description: `# Ải 9 — Fetch API\n\nViết async function \`getUser(id)\` dùng Fetch API:\n- Gọi \`https://jsonplaceholder.typicode.com/users/{id}\`\n- Xử lý response với \`.json()\`\n- Dùng try/catch để bắt lỗi network\n- Nếu response không ok (status >= 400), throw Error\n\nTrả về object user hoặc null nếu lỗi.`,
      initialCode: `async function getUser(id) {\n  try {\n    // Dùng fetch() ở đây\n    \n  } catch (error) {\n    console.error("Fetch failed:", error.message);\n    return null;\n  }\n}\n\ngetUser(1).then(console.log);\n`,
      solutionHint: "fetch() trả về Promise<Response>. Cần await hai lần: fetch() và .json().",
      validationPattern: "fetch|await|response\\.json|try|catch",
    },
    {
      nodeId: node10.id,
      description: `# Ải 10 — Module & Import/Export\n\nViết module \`utils.js\` với:\n- **Named export** function \`formatLevel(level)\` → trả về chuỗi \`"Lv. 42"\`\n- **Named export** const \`MAX_LEVEL = 100\`\n- **Default export** object \`{ version: "1.0.0", author: "your-name" }\`\n\nSau đó viết cú pháp import tất cả vào \`main.js\`.\n\n**Ghi nhớ:** Một file chỉ có 1 default export nhưng nhiều named export.`,
      initialCode: `// utils.js\n// Viết exports ở đây\n\n\n// main.js\n// Viết imports ở đây\n`,
      solutionHint: "Named export: export function/const. Default export: export default. Import: import defaultExport, { named } from './utils'",
      validationPattern: "export\\s+function|export\\s+const|export\\s+default|import",
    },
  ];

  for (const mission of missions) {
    await prisma.mission.create({ data: mission });
  }

  console.log(`✅ Seed hoàn tất:`);
  console.log(`   - 1 Roadmap: "${roadmap.title}"`);
  console.log(`   - 3 Chapters: Nền Tảng | Hàm & Cấu Trúc | Ứng Dụng Thực Tế`);
  console.log(`   - 10 Nodes với đầy đủ Mission`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
