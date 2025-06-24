import { prismaClient as prisma } from '@/services'
import { hash } from 'bcrypt'

const PASTRIES_IMAGES = {
  brioche1: 'https://images.unsplash.com/photo-1552056413-b8b5eed0170b?q=80&w=858&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  brioche2: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  chouquette: 'https://images.ricardocuisine.com/services/recipes/7855-1519923152.jpg',
  croissant: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=800&h=600&fit=crop',
  eclairAuChocolat: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxs9zU7IVzQhOtwGdzf3-VeT1lARHm5DkJjw&s',
  financier: 'https://img.over-blog-kiwi.com/0/65/19/23/20140910/ob_6c1bd2_financiers-aux-amandes-1.jpg',
  flanPatissier: 'https://cdn.prod.website-files.com/5f6fa8c81234785d29df27c1/653fe8965cc088d28eced01c_Flan%20pa%CC%82tissier%20sans%20gluten%204.webp',
  foretNoire: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnh-2gqkknV8WVmnrTcN7J8f9bM8ZZcfCKAQ&s',
  fraisier: 'https://d2y8lrt1ygofia.cloudfront.net/q4dpcqipx9mitq1huixz3b7ggz23',
  madeleine: 'https://static01.nyt.com/images/2025/03/11/multimedia/Madeleines-new-cmwz/Madeleines-new-cmwz-mediumSquareAt3X.jpg',
  milleFeuille: 'https://adc-dev-images-recipes.s3.eu-west-1.amazonaws.com/lv_23790_millefeuilles_bd.jpg',
  montBlanc: 'https://cache.marieclaire.fr/data/photo/w1000_ci/1pe/recette-mont-blanc-marrons.jpg',
  muffin: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm-NwO0zqR2rGOTU4y0AlDM-q0x5ejL6jsrQ&s',
  opera: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNVm8vqk2lvAW0CxulbWa8Am-OFM3xTBqB-A&s',
  painAuChocolat: 'https://images.unsplash.com/photo-1681218424681-b4f8228ecea9?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  painAuRaisin: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXn968tFc6p5SON5Ke9tBmmHnMX6x0j337g&s',
  painSuisse: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMfQFQjMvXNXhBWOQ11aGm3vlbR9NVoX3SXw&s',
  parisBrest: 'https://oliviapatisse.com/wp-content/uploads/2020/01/vi.jpg',
  religieuse: 'https://labonnevague.com/wp-content/uploads/2023/07/606-AMB-RELIGIEUSE-CHOCO-100G-scaled-1.jpg',
  sable: 'https://cdn.chefclub.tools/uploads/recipes/cover-thumbnail/88d3cd1c-6e96-47ed-9d74-9e15550d4ba8_q1aU5ZG.jpg',
  saintHonore: 'https://chefsquare.fr/media/catalog/product/cache/ba664c13fa4d9dee95ca9c0cf96f6c50/s/a/saint-honore_base4.jpg',
  tarteAuChocolat: 'https://www.maspatule.com/blog/wp-content/uploads/2020/04/Tarte-chocolat-modif-1440x2159.jpg',
  tarteAuCitron: 'https://img.cuisineaz.com/660x660/2024/10/07/i200500-tarte-au-citron-simple.jpg',
  tarteAuxAbricots: 'https://img.cuisineaz.com/1024x1024/2015/07/07/i5206-tarte-normande-aux-abricots.webp',
  tarteAuxFraises: 'https://l-herboriste.com/wp-content/uploads/2021/04/Tarte-aux-fraises-500x500.jpg',
  tarteAuxMyrtilles: 'https://www.paul.fr/media/catalog/product/2/0/2020-pack-pas-tarte-myrtilles-part-seule.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=700',
  tarteAuxPommes: 'https://www.auxdelicesdupalais.net/wp-content/uploads/2019/03/DSC01764.jpg',
}

async function main() {
  // Clean existing data
  console.log('🧹 Nettoyage de la base de données...')

  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.pastry.deleteMany()
  await prisma.category.deleteMany()
  await prisma.diet.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Base de données nettoyée')

  // Créer un utilisateur de test
  const hashedPassword = await hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '+33612345678',
      addresses: ['123 Rue de la Pâtisserie, 75001 Paris'],
      preferences: {
        favoriteCategories: ['Gateaux', 'Viennoiseries'],
        dietaryRestrictions: ['Sans gluten']
      },
      cart: {
        create: {
          updatedAt: new Date()
        }
      }
    },
    include: {
      cart: true
    }
  })

  console.log('✅ User créés')

  const categoriesData = [
    { name: 'Viennoiseries' },
    { name: 'Pâtisseries' },
    { name: 'Gâteaux' },
    { name: 'Petits gâteaux' },
    { name: 'Tartes' },
  ]
  const categories: { [key: string]: string } = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories[cat.name] = created.id
  }

  console.log('✅ Catégories créées')

  const dietsData = [
    { name: 'Végétarien' },
    { name: 'Vegan' },
    { name: 'Sans Gluten' },
    { name: 'Sans Lactose' },
    { name: 'Sans Sucre' },
  ]
  const diets: { [key: string]: string } = {}
  for (const diet of dietsData) {
    const created = await prisma.diet.create({ data: diet })
    diets[diet.name] = created.id
  }

  console.log('✅ Diets créés')

  // Créer toutes les pâtisseries
  const pastries = await Promise.all([
    // Brioche
    prisma.pastry.create({
      data: {
        name: 'Brioche Artisanale',
        description: 'Brioche traditionnelle française, moelleuse et dorée',
        price: 6.90,
        images: [PASTRIES_IMAGES.brioche1, PASTRIES_IMAGES.brioche2],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Farine', 'Beurre', 'Œufs', 'Lait', 'Levure'],
        nutrition: {
          calories: 280,
          protein: 8.2,
          carbs: 35.4,
          fat: 12.8,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 15,
        slug: 'brioche-artisanale',
      }
    }),

    // Chouquette
    prisma.pastry.create({
      data: {
        name: 'Chouquettes',
        description: 'Petits choux sucrés parsemés de grains de sucre perlé',
        price: 1.50,
        images: [PASTRIES_IMAGES.chouquette],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Populaire'],
        ingredients: ['Pâte à choux', 'Sucre perlé', 'Œufs', 'Beurre'],
        nutrition: {
          calories: 85,
          protein: 2.1,
          carbs: 10.5,
          fat: 4.2,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 100,
        slug: 'chouquettes',
      }
    }),

    // Croissant
    prisma.pastry.create({
      data: {
        name: 'Croissant au Beurre',
        description: 'Croissant feuilleté au beurre français, croustillant et fondant',
        price: 1.80,
        images: [PASTRIES_IMAGES.croissant],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Populaire'],
        ingredients: ['Pâte feuilletée', 'Beurre français', 'Farine', 'Levure'],
        nutrition: {
          calories: 231,
          protein: 4.7,
          carbs: 26.1,
          fat: 12.0,
          allergens: ['gluten', 'lait']
        },
        stockCount: 50,
        slug: 'croissant-beurre',
      }
    }),

    // Éclair
    prisma.pastry.create({
      data: {
        name: 'Éclair au Chocolat',
        description: 'Éclair garni de crème pâtissière au chocolat noir et glaçage brillant',
        price: 4.50,
        images: [PASTRIES_IMAGES.eclairAuChocolat],
        category: { connect: { id: categories['Pâtisseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Populaire'],
        ingredients: ['Pâte à choux', 'Crème pâtissière au chocolat', 'Glaçage chocolat'],
        nutrition: {
          calories: 265,
          protein: 5.2,
          carbs: 28.4,
          fat: 15.6,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 25,
        slug: 'eclair-chocolat',
      }
    }),

    // Financier
    prisma.pastry.create({
      data: {
        name: 'Financier aux Amandes',
        description: 'Petit gâteau moelleux aux amandes et beurre noisette',
        price: 2.80,
        images: [PASTRIES_IMAGES.financier],
        category: { connect: { id: categories['Petits gâteaux'] } },
        diet: { connect: { id: diets['Sans Gluten'] } },
        tags: [],
        ingredients: ['Poudre d\'amandes', 'Beurre noisette', 'Blancs d\'œufs', 'Sucre glace'],
        nutrition: {
          calories: 195,
          protein: 4.8,
          carbs: 18.2,
          fat: 12.4,
          allergens: ['fruits à coque', 'œufs', 'lait']
        },
        stockCount: 30,
        slug: 'financier-amandes',
      }
    }),

    // Flan Pâtissier
    prisma.pastry.create({
      data: {
        name: 'Flan Pâtissier',
        description: 'Flan parisien traditionnel sur pâte brisée, vanille bourbon',
        price: 18.50,
        images: [PASTRIES_IMAGES.flanPatissier],
        category: { connect: { id: categories['Pâtisseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Populaire'],
        ingredients: ['Lait', 'Œufs', 'Vanille bourbon', 'Pâte brisée', 'Sucre'],
        nutrition: {
          calories: 245,
          protein: 6.8,
          carbs: 32.1,
          fat: 10.5,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 8,
        slug: 'flan-patissier',
      }
    }),

    // Forêt Noire
    prisma.pastry.create({
      data: {
        name: 'Forêt Noire',
        description: 'Gâteau au chocolat, cerises griottes et chantilly, kirsch',
        price: 32.90,
        images: [PASTRIES_IMAGES.foretNoire],
        category: { connect: { id: categories['Gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Nouveau'],
        ingredients: ['Génoise chocolat', 'Cerises griottes', 'Chantilly', 'Kirsch'],
        nutrition: {
          calories: 385,
          protein: 5.4,
          carbs: 38.7,
          fat: 24.2,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 6,
        slug: 'foret-noire',
      }
    }),

    // Fraisier
    prisma.pastry.create({
      data: {
        name: 'Fraisier',
        description: 'Gâteau aux fraises fraîches, crème mousseline et génoise',
        price: 28.90,
        images: [PASTRIES_IMAGES.fraisier],
        category: { connect: { id: categories['Gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Fraises fraîches', 'Crème mousseline', 'Génoise', 'Pâte d\'amande'],
        nutrition: {
          calories: 295,
          protein: 4.2,
          carbs: 35.8,
          fat: 15.6,
          allergens: ['gluten', 'œufs', 'lait', 'fruits à coque']
        },
        stockCount: 5,
        slug: 'fraisier',
      }
    }),

    // Madeleine
    prisma.pastry.create({
      data: {
        name: 'Madeleines de Commercy',
        description: 'Madeleines traditionnelles au citron et beurre de Charentes',
        price: 8.90,
        images: [PASTRIES_IMAGES.madeleine],
        category: { connect: { id: categories['Petits gâteaux'] } },
        tags: [],
        ingredients: ['Farine', 'Beurre de Charentes', 'Citron', 'Œufs', 'Miel'],
        nutrition: {
          calories: 165,
          protein: 3.8,
          carbs: 22.4,
          fat: 7.2,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 24,
        slug: 'madeleines-commercy',
      }
    }),

    // Mille-feuille
    prisma.pastry.create({
      data: {
        name: 'Mille-feuille Vanille',
        description: 'Feuilletage croustillant, crème pâtissière vanille, glaçage fondant',
        price: 5.90,
        images: [PASTRIES_IMAGES.milleFeuille],
        category: { connect: { id: categories['Gâteaux'] } },
        tags: [],
        ingredients: ['Pâte feuilletée', 'Crème pâtissière vanille', 'Glaçage fondant'],
        nutrition: {
          calories: 320,
          protein: 4.5,
          carbs: 35.2,
          fat: 18.8,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 12,
        slug: 'mille-feuille-vanille',
      }
    }),

    // Mont-Blanc
    prisma.pastry.create({
      data: {
        name: 'Mont-Blanc aux Marrons',
        description: 'Meringue, chantilly et crème de marrons de l\'Ardèche',
        price: 7.50,
        images: [PASTRIES_IMAGES.montBlanc],
        category: { connect: { id: categories['Gâteaux'] } },
        tags: [],
        ingredients: ['Crème de marrons', 'Meringue', 'Chantilly', 'Marrons glacés'],
        nutrition: {
          calories: 285,
          protein: 3.8,
          carbs: 42.5,
          fat: 12.2,
          allergens: ['œufs', 'lait']
        },
        stockCount: 8,
        slug: 'mont-blanc-marrons',
      }
    }),

    // Muffin
    prisma.pastry.create({
      data: {
        name: 'Muffin aux Myrtilles',
        description: 'Muffin américain aux myrtilles sauvages et streusel',
        price: 3.20,
        images: [PASTRIES_IMAGES.muffin],
        category: { connect: { id: categories['Pâtisseries'] } },
        tags: [],
        ingredients: ['Myrtilles sauvages', 'Farine', 'Beurre', 'Streusel'],
        nutrition: {
          calories: 245,
          protein: 4.2,
          carbs: 38.5,
          fat: 9.8,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 20,
        slug: 'muffin-myrtilles',
      }
    }),

    // Opéra
    prisma.pastry.create({
      data: {
        name: 'Opéra',
        description: 'Biscuit joconde, ganache chocolat, crème au beurre café',
        price: 8.90,
        images: [PASTRIES_IMAGES.opera],
        category: { connect: { id: categories['Gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Biscuit joconde', 'Ganache chocolat', 'Crème café', 'Glaçage'],
        nutrition: {
          calories: 420,
          protein: 6.8,
          carbs: 32.4,
          fat: 30.5,
          allergens: ['gluten', 'œufs', 'lait', 'fruits à coque']
        },
        stockCount: 6,
        slug: 'opera',
      }
    }),

    // Pain au Chocolat
    prisma.pastry.create({
      data: {
        name: 'Pain au Chocolat',
        description: 'Viennoiserie feuilletée avec deux barres de chocolat noir',
        price: 2.10,
        images: [PASTRIES_IMAGES.painAuChocolat],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: ['Populaire'],
        ingredients: ['Pâte feuilletée', 'Chocolat noir 70%', 'Beurre'],
        nutrition: {
          calories: 285,
          protein: 5.8,
          carbs: 28.6,
          fat: 17.2,
          allergens: ['gluten', 'lait']
        },
        stockCount: 40,
        slug: 'pain-chocolat',
      }
    }),

    // Pain aux Raisins
    prisma.pastry.create({
      data: {
        name: 'Pain aux Raisins',
        description: 'Spirale de pâte feuilletée, crème pâtissière et raisins secs',
        price: 2.30,
        images: [PASTRIES_IMAGES.painAuRaisin],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte feuilletée', 'Crème pâtissière', 'Raisins secs', 'Rhum'],
        nutrition: {
          calories: 265,
          protein: 5.2,
          carbs: 35.8,
          fat: 12.4,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 25,
        slug: 'pain-raisins',
      }
    }),

    // Pain Suisse
    prisma.pastry.create({
      data: {
        name: 'Pain Suisse',
        description: 'Pâte feuilletée, crème pâtissière vanille et pépites de chocolat',
        price: 2.80,
        images: [PASTRIES_IMAGES.painSuisse],
        category: { connect: { id: categories['Viennoiseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte feuilletée', 'Crème pâtissière vanille', 'Pépites chocolat'],
        nutrition: {
          calories: 295,
          protein: 6.2,
          carbs: 32.4,
          fat: 16.8,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 15,
        slug: 'pain-suisse',
      }
    }),

    // Paris-Brest
    prisma.pastry.create({
      data: {
        name: 'Paris-Brest',
        description: 'Pâte à choux en couronne, crème pralinée et amandes effilées',
        price: 24.90,
        images: [PASTRIES_IMAGES.parisBrest],
        category: { connect: { id: categories['Gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte à choux', 'Crème pralinée', 'Amandes effilées', 'Praliné maison'],
        nutrition: {
          calories: 385,
          protein: 7.5,
          carbs: 42.3,
          fat: 21.8,
          allergens: ['fruits à coque', 'gluten', 'œufs', 'lait']
        },
        stockCount: 10,
        slug: 'paris-brest',
      }
    }),

    // Religieuse
    prisma.pastry.create({
      data: {
        name: 'Religieuse au Chocolat',
        description: 'Deux choux superposés, crème chocolat et glaçage chocolat',
        price: 6.50,
        images: [PASTRIES_IMAGES.religieuse],
        category: { connect: { id: categories['Pâtisseries'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte à choux', 'Crème pâtissière chocolat', 'Glaçage chocolat'],
        nutrition: {
          calories: 325,
          protein: 6.4,
          carbs: 32.8,
          fat: 19.5,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 12,
        slug: 'religieuse-chocolat',
      }
    }),

    // Sablé
    prisma.pastry.create({
      data: {
        name: 'Sablé Breton',
        description: 'Biscuit épais au beurre demi-sel, fondant et croustillant',
        price: 3.50,
        images: [PASTRIES_IMAGES.sable],
        category: { connect: { id: categories['Petits gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Farine', 'Beurre demi-sel', 'Sucre', 'Œufs'],
        nutrition: {
          calories: 220,
          protein: 3,
          carbs: 24,
          fat: 12,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 25,
        slug: 'sable-breton',
      }
    }),

    // Saint-Honoré
    prisma.pastry.create({
      data: {
        name: 'Saint-Honoré',
        description: 'Base de pâte feuilletée, choux caramélisés, crème Chantilly',
        price: 7.20,
        images: [PASTRIES_IMAGES.saintHonore],
        category: { connect: { id: categories['Gâteaux'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte feuilletée', 'Pâte à choux', 'Crème Chantilly', 'Caramel'],
        nutrition: {
          calories: 390,
          protein: 5,
          carbs: 36,
          fat: 24,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 10,
        slug: 'saint-honore',
      }
    }),

    // Tarte au Chocolat
    prisma.pastry.create({
      data: {
        name: 'Tarte au Chocolat',
        description: 'Pâte sablée garnie d\'une ganache fondante au chocolat noir',
        price: 5.80,
        images: [PASTRIES_IMAGES.tarteAuChocolat],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte sablée', 'Chocolat noir', 'Crème', 'Beurre'],
        nutrition: {
          calories: 340,
          protein: 4,
          carbs: 30,
          fat: 22,
          allergens: ['gluten', 'lait']
        },
        stockCount: 14,
        slug: 'tarte-chocolat',
      }
    }),

    // Tarte au Citron
    prisma.pastry.create({
      data: {
        name: 'Tarte au Citron',
        description: 'Tarte au citron classique avec une crème citron acidulée sur pâte sablée',
        price: 5.50,
        images: [PASTRIES_IMAGES.tarteAuCitron],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte sablée', 'Citron', 'Œufs', 'Sucre', 'Beurre'],
        nutrition: {
          calories: 280,
          protein: 3,
          carbs: 35,
          fat: 12,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 16,
        slug: 'tarte-citron',
      }
    }),

    // Tarte sans lactose
    prisma.pastry.create({
      data: {
        name: 'Tarte au Citron Sans Lactose',
        description: 'Tarte au citron traditionnelle sans produits laitiers',
        price: 5.80,
        images: [PASTRIES_IMAGES.tarteAuCitron],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Sans Lactose'] } },
        tags: ['Spécial'],
        ingredients: ['Pâte sablée', 'Citron', 'Œufs', 'Sucre', 'Margarine végétale'],
        nutrition: {
          calories: 260,
          protein: 3.5,
          carbs: 32,
          fat: 11,
          allergens: ['gluten', 'œufs']
        },
        stockCount: 12,
        slug: 'tarte-citron-sans-lactose',
      }
    }),

    // Tarte aux Abricots
    prisma.pastry.create({
      data: {
        name: 'Tarte aux Abricots',
        description: 'Tarte estivale garnie d\'abricots frais sur une base d\'amande',
        price: 5.40,
        images: [PASTRIES_IMAGES.tarteAuxAbricots],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte sablée', 'Abricots', 'Poudre d\'amande', 'Sucre'],
        nutrition: {
          calories: 295,
          protein: 4,
          carbs: 35,
          fat: 16,
          allergens: ['gluten', 'œufs', 'fruits à coque']
        },
        stockCount: 12,
        slug: 'tarte-abricots',
      }
    }),

    // Tarte aux Fraises
    prisma.pastry.create({
      data: {
        name: 'Tarte aux Fraises',
        description: 'Pâte sablée, crème pâtissière et fraises fraîches',
        price: 5.90,
        images: [PASTRIES_IMAGES.tarteAuxFraises],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte sablée', 'Fraises', 'Crème pâtissière', 'Gélatine'],
        nutrition: {
          calories: 310,
          protein: 3,
          carbs: 38,
          fat: 16,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 18,
        slug: 'tarte-fraises',
      }
    }),

    // Tarte aux Myrtilles
    prisma.pastry.create({
      data: {
        name: 'Tarte aux Myrtilles',
        description: 'Garniture généreuse de myrtilles sur pâte croustillante',
        price: 6.10,
        images: [PASTRIES_IMAGES.tarteAuxMyrtilles],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte sablée', 'Myrtilles', 'Sucre', 'Maïzena'],
        nutrition: {
          calories: 305,
          protein: 2.5,
          carbs: 39,
          fat: 15,
          allergens: ['gluten']
        },
        stockCount: 15,
        slug: 'tarte-myrtilles',
      }
    }),

    // Tarte aux Pommes
    prisma.pastry.create({
      data: {
        name: 'Tarte aux Pommes',
        description: 'Fine pâte garnie de compote et lamelles de pommes caramélisées',
        price: 5.30,
        images: [PASTRIES_IMAGES.tarteAuxPommes],
        category: { connect: { id: categories['Tartes'] } },
        diet: { connect: { id: diets['Végétarien'] } },
        tags: [],
        ingredients: ['Pâte feuilletée', 'Pommes', 'Compote', 'Sucre'],
        nutrition: {
          calories: 280,
          protein: 2,
          carbs: 34,
          fat: 14,
          allergens: ['gluten', 'lait']
        },
        stockCount: 20,
        slug: 'tarte-pommes',
      }
    }),

  ])

  console.log('✅ Pâtisseries créées')

  console.log('✅ Base de données initialisée avec succès !')
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
