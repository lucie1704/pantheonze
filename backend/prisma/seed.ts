import { prismaClient } from "@/services";

async function main() {
  // Clean existing data
  await prismaClient.pastry.deleteMany();

  // Seed pastries
  const pastries = [
    {
      name: "Éclair au Chocolat",
      description: "Pâte à choux croustillante garnie d'une crème pâtissière au chocolat noir",
      price: 4.50,
      imageUrl: "https://example.com/eclair-chocolat.jpg",
      category: "choux",
      ingredients: ["farine", "oeufs", "chocolat noir", "crème", "beurre"]
    },
    {
      name: "Paris-Brest",
      description: "Couronne de pâte à choux garnie de crème pralinée aux noisettes",
      price: 5.50,
      imageUrl: "https://example.com/paris-brest.jpg",
      category: "choux",
      ingredients: ["farine", "oeufs", "noisettes", "crème", "pralin"]
    },
    {
      name: "Tarte aux Fraises",
      description: "Pâte sablée, crème pâtissière à la vanille et fraises fraîches",
      price: 6.00,
      imageUrl: "https://example.com/tarte-fraises.jpg",
      category: "tarte",
      ingredients: ["farine", "beurre", "fraises", "crème", "vanille"]
    },
    {
      name: "Millefeuille",
      description: "Trois couches de pâte feuilletée, crème vanille et glaçage",
      price: 5.50,
      imageUrl: "https://example.com/millefeuille.jpg",
      category: "feuilleté",
      ingredients: ["pâte feuilletée", "crème", "vanille", "fondant", "chocolat"]
    },
    {
      name: "Macaron Framboise",
      description: "Coques en meringue et ganache à la framboise",
      price: 2.50,
      imageUrl: "https://example.com/macaron-framboise.jpg",
      category: "macaron",
      ingredients: ["amandes", "sucre", "framboises", "chocolat blanc"]
    }
  ];

  for (const pastry of pastries) {
    await prismaClient.pastry.create({
      data: pastry
    });
  }

  console.log("🍰 Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });