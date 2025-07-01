import { prismaClient as prisma } from '@/services'
import { hash } from 'bcrypt'
import { OrderStatus } from '@prisma/client'

const PASTRIES_IMAGES = {
  brioche1: 'https://images.unsplash.com/photo-1552056413-b8b5eed0170b?q=80&w=858&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  brioche2: 'https://images.unsplash.com/photo-1620921568790-c1cf8984624c?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  brownie: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ25CXHgbxRxsfkdbvuAtEWUvd3JEux675UgA&s',
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
  muffinSansSucre: 'https://mariefoodtips.com/wp-content/uploads/2023/01/muffins-aux-pommes.jpg',
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

  console.log('✅ Catégories')

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

  console.log('✅ Régimes alimentaires')

  // Créer les utilisateurs de test
  const hashedPassword = await hash('P@nt3h0nz3_2025!', 10)

  const adminJeromeBouchet = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hashedPassword,
      name: 'Jérôme BOUCHET',
      phone: '0123456789',
      role: 'ADMIN',
    }
  })

  const storeKeeperAndreeFaire = await prisma.user.create({
    data: {
      email: 'andree.faire@demo.com',
      password: hashedPassword,
      name: 'Andrée FAIRE',
      phone: '0987654321',
      role: 'STOREKEEPER',
    }
  })


  // Créer des comptes clients avec différentes préférences alimentaires
  const clientMarieJacques = await prisma.user.create({
    data: {
      email: 'marie.jacques@demo.com',
      password: hashedPassword,
      name: 'Marie JACQUES',
      phone: '0111222333',
      role: 'CLIENT',
      userDiets: {
        create: [
          { dietId: diets['Vegan'] },
          { dietId: diets['Sans Gluten'] }
        ]
      }
    }
  })

  const clientPierreLaroche = await prisma.user.create({
    data: {
      email: 'pierre.laroche@demo.com',
      password: hashedPassword,
      name: 'Pierre LAROCHE',
      phone: '0444555666',
      role: 'CLIENT',
      userDiets: {
        create: [
          { dietId: diets['Sans Sucre'] },
          { dietId: diets['Sans Lactose'] }
        ]
      }
    }
  })

  const clientSophieOlivier = await prisma.user.create({
    data: {
      email: 'sophie.olivier@demo.com',
      password: hashedPassword,
      name: 'Sophie OLIVIER',
      phone: '0777888999',
      role: 'CLIENT',
    }
  })

  console.log('✅ Utilisateurs')

  // Créer toutes les pâtisseries
  const pastries = await Promise.all([
    // Brioche
    prisma.pastry.create({
      data: {
        name: 'Brioche Artisanale',
        description: 'Notre brioche artisanale est préparée selon la tradition française avec une pâte enrichie au beurre de Charentes AOP. Sa texture est exceptionnellement moelleuse et aérée, avec une croûte dorée et brillante. Chaque bouchée révèle des notes de beurre noisette et une douceur incomparable.',
        price: 6.90,
        images: [PASTRIES_IMAGES.brioche1, PASTRIES_IMAGES.brioche2],
        category: { connect: { id: categories['Viennoiseries'] } },
        dietIds: [diets['Végétarien'], diets['Vegan']],
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
        description: 'Ces délicates chouquettes sont préparées avec une pâte à choux légère et aérée, parsemées de grains de sucre perlé qui apportent un délicieux croquant. Chaque petite boule est cuite à la perfection pour obtenir une texture moelleuse à l\'intérieur et légèrement croustillante à l\'extérieur.',
        price: 1.50,
        images: [PASTRIES_IMAGES.chouquette],
        category: { connect: { id: categories['Viennoiseries'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'Notre croissant au beurre est le fruit d\'un savoir-faire traditionnel français. La pâte feuilletée est réalisée avec du beurre français de qualité supérieure, créant des couches fines et croustillantes. Sa forme en croissant de lune et sa texture feuilletée en font un incontournable.',
        price: 1.80,
        images: [PASTRIES_IMAGES.croissant],
        category: { connect: { id: categories['Viennoiseries'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'Notre éclair au chocolat est une création raffinée qui allie tradition et modernité. La pâte à choux est cuite à la perfection pour obtenir une texture légère et aérée. L\'intérieur est garni d\'une crème pâtissière onctueuse au chocolat noir, le tout recouvert d\'un glaçage brillant.',
        price: 4.50,
        images: [PASTRIES_IMAGES.eclairAuChocolat],
        category: { connect: { id: categories['Pâtisseries'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'Le financier aux amandes est un petit gâteau raffiné qui tire son nom de sa forme rectangulaire rappelant un lingot d\'or. Sa texture est exceptionnellement moelleuse grâce à la poudre d\'amandes et au beurre noisette. Un délice subtil et élégant.',
        price: 2.80,
        images: [PASTRIES_IMAGES.financier],
        category: { connect: { id: categories['Petits gâteaux'] } },
        dietIds: [diets['Sans Gluten']],
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
        description: 'Notre flan pâtissier est préparé selon la recette traditionnelle parisienne. La pâte brisée maison est garnie d\'une crème à la vanille bourbon de Madagascar, créant un équilibre parfait entre la croûte croustillante et la crème onctueuse.',
        price: 18.50,
        images: [PASTRIES_IMAGES.flanPatissier],
        category: { connect: { id: categories['Pâtisseries'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'La Forêt Noire est un gâteau d\'exception qui allie la richesse du chocolat noir à la fraîcheur des cerises griottes. Les couches de génoise au chocolat sont imbibées de kirsch et garnies de crème chantilly. Un classique allemand revisité.',
        price: 32.90,
        images: [PASTRIES_IMAGES.foretNoire],
        category: { connect: { id: categories['Gâteaux'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'Le fraisier est un gâteau d\'exception qui célèbre la fraise dans toute sa splendeur. Les fraises fraîches de saison sont disposées avec soin entre deux couches de génoise légère, imbibée de sirop et garnie de crème mousseline.',
        price: 28.90,
        images: [PASTRIES_IMAGES.fraisier],
        category: { connect: { id: categories['Gâteaux'] } },
        dietIds: [diets['Végétarien']],
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
        description: 'Nos madeleines de Commercy sont préparées selon la recette traditionnelle de cette ville lorraine. La pâte est enrichie au beurre de Charentes AOP et parfumée au citron frais, créant des petits gâteaux moelleux et parfumés.',
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
        description: 'Le mille-feuille vanille est un chef-d\'œuvre de la pâtisserie française qui allie technique et raffinement. Les couches de pâte feuilletée sont cuites à la perfection pour obtenir un feuilletage croustillant, alternant avec de la crème pâtissière.',
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
        description: 'Le Mont-Blanc aux marrons est une création d\'exception qui évoque le sommet enneigé du massif alpin. La base est une meringue légère et croustillante, surmontée d\'une chantilly fraîche et de vermicelles de marrons glacés.',
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
        description: 'Notre muffin aux myrtilles est inspiré des recettes américaines traditionnelles. La pâte moelleuse est enrichie de myrtilles sauvages fraîches qui éclatent en bouche, libérant leur saveur acidulée et leur jus parfumé.',
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
        dietIds: [],
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
        dietIds: [],
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
        dietIds: [],
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
        dietIds: [],
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
        dietIds: [diets['Végétarien']],
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
        name: 'Religieuse au Café',
        description: 'Deux choux superposés, crème pâtissière café et glaçage fondant',
        price: 6.50,
        images: [PASTRIES_IMAGES.religieuse],
        category: { connect: { id: categories['Pâtisseries'] } },
        tags: [],
        ingredients: ['Pâte à choux', 'Crème pâtissière café', 'Glaçage fondant'],
        nutrition: {
          calories: 315,
          protein: 5.8,
          carbs: 35.6,
          fat: 18.4,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 12,
        slug: 'religieuse-cafe',
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
        dietIds: [diets['Végétarien']],
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
        description: 'Pâte brisée, choux à la crème chantilly et caramel',
        price: 28.90,
        images: [PASTRIES_IMAGES.saintHonore],
        category: { connect: { id: categories['Gâteaux'] } },
        tags: ['Nouveau'],
        ingredients: ['Pâte brisée', 'Choux à la crème', 'Chantilly', 'Caramel'],
        nutrition: {
          calories: 425,
          protein: 6.2,
          carbs: 38.7,
          fat: 28.5,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 4,
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
        dietIds: [diets['Végétarien']],
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
        name: 'Tarte au Citron Meringuée',
        description: 'Pâte sablée, crème citron et meringue italienne',
        price: 22.50,
        images: [PASTRIES_IMAGES.tarteAuCitron],
        category: { connect: { id: categories['Tartes'] } },
        tags: ['Populaire'],
        ingredients: ['Pâte sablée', 'Crème citron', 'Meringue italienne', 'Citrons bio'],
        nutrition: {
          calories: 285,
          protein: 4.8,
          carbs: 32.4,
          fat: 16.2,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 6,
        slug: 'tarte-citron-meringuee',
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
        dietIds: [diets['Sans Lactose']],
        tags: [],
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
        dietIds: [diets['Végétarien'], diets['Sans Lactose']],
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
        dietIds: [diets['Végétarien'], diets['Vegan']],
        tags: [],
        ingredients: ['Pâte sablée', 'Fraises', 'Crème pâtissière', 'Gélatine'],
        nutrition: {
          calories: 310,
          protein: 3,
          carbs: 38,
          fat: 16,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 0,
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
        dietIds: [diets['Végétarien'], diets['Vegan']],
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
        dietIds: [diets['Végétarien']],
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

    // Brownie Vegan
    prisma.pastry.create({
      data: {
        name: 'Brownie aux Noix',
        description: 'Brownie fondant sans produits animaux, chocolat noir et noix',
        price: 4.50,
        images: [PASTRIES_IMAGES.brownie],
        category: { connect: { id: categories['Petits gâteaux'] } },
        dietIds: [diets['Vegan']],
        tags: ['Nouveau'],
        ingredients: ['Farine complète', 'Chocolat noir vegan', 'Lait d\'amande', 'Huile de coco', 'Noix', 'Sucre de coco'],
        nutrition: {
          calories: 320,
          protein: 6,
          carbs: 28,
          fat: 18,
          allergens: ['gluten', 'fruits à coque']
        },
        stockCount: 18,
        slug: 'brownie-vegan-noix',
      }
    }),

    // Muffin Sans Sucre
    prisma.pastry.create({
      data: {
        name: 'Muffin Pomme-Cannelle',
        description: 'Muffin moelleux sucré naturellement aux pommes et dattes',
        price: 3.80,
        images: [PASTRIES_IMAGES.muffinSansSucre],
        category: { connect: { id: categories['Pâtisseries'] } },        
        dietIds: [diets['Sans Sucre']],
        tags: [],
        ingredients: ['Farine d\'avoine', 'Pommes', 'Dattes', 'Cannelle', 'Œufs', 'Yaourt grec', 'Levure'],
        nutrition: {
          calories: 185,
          protein: 8,
          carbs: 22,
          fat: 6,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 25,
        slug: 'muffin-pomme-cannelle-sans-sucre',
      }
    }),
  ])

  console.log('✅ Pâtisseries')

  // Récupérer des pâtisseries spécifiques pour les commandes
  const brioche = await prisma.pastry.findFirst({ where: { slug: 'brioche-artisanale' } })
  const chouquettes = await prisma.pastry.findFirst({ where: { slug: 'chouquettes' } })
  const croissant = await prisma.pastry.findFirst({ where: { slug: 'croissant-beurre' } })
  const painAuChocolat = await prisma.pastry.findFirst({ where: { slug: 'pain-chocolat' } })
  const eclair = await prisma.pastry.findFirst({ where: { slug: 'eclair-chocolat' } })
  const tarteCitron = await prisma.pastry.findFirst({ where: { slug: 'tarte-citron-meringuee' } })
  const brownieVegan = await prisma.pastry.findFirst({ where: { slug: 'brownie-vegan-noix' } })
  const muffinSansSucre = await prisma.pastry.findFirst({ where: { slug: 'muffin-pomme-cannelle-sans-sucre' } })

  if (brioche && chouquettes && croissant && painAuChocolat && eclair && tarteCitron && brownieVegan && muffinSansSucre) {
    // Commande 1 pour Marie Jacques (vegan + sans gluten) - commande récupérée
    const order1Marie = await prisma.order.create({
      data: {
        userId: clientMarieJacques.id,
        customerName: 'Marie JACQUES',
        customerEmail: 'marie.jacques@demo.com',
        customerPhone: '0111222333',
        subtotal: 15.90,
        taxAmount: 3.18,
        discount: 0,
        total: 19.08,
        status: 'PICKED_UP' as any,
        paymentMethod: 'Carte bancaire',
        paymentStatus: 'PAID',
        estimatedReady: new Date(Date.now() - 2 * 60 * 60 * 1000), // +2h
        readyAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // +1.5h
        pickedUpAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // -1h
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // -7 jours
      }
    })

    // Créer les items pour la commande 1 de Marie
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order1Marie.id,
          pastryId: brioche.id,
          name: brioche.name,
          quantity: 1,
          price: brioche.price
        },
        {
          orderId: order1Marie.id,
          pastryId: brownieVegan.id,
          name: brownieVegan.name,
          quantity: 2,
          price: brownieVegan.price
        }
      ]
    })

    // Commande 2 pour Marie Jacques - en attente
    const order2Marie = await prisma.order.create({
      data: {
        userId: clientMarieJacques.id,
        customerName: 'Marie JACQUES',
        customerEmail: 'marie.jacques@demo.com',
        customerPhone: '0111222333',
        subtotal: 4.50, // 1 × 4.50 (brownie vegan)
        taxAmount: 0.90, // 20% TVA sur 4.50
        discount: 0,
        total: 5.40, // 4.50 + 0.90
        status: OrderStatus.PENDING,
        paymentMethod: 'Espèces',
        paymentStatus: 'PENDING',
        estimatedReady: new Date(Date.now() + 3 * 60 * 60 * 1000), // +3h
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 jours
      }
    })

    // Créer les items pour la commande 2 de Marie
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order2Marie.id,
          pastryId: brownieVegan.id,
          name: brownieVegan.name,
          quantity: 1,
          price: brownieVegan.price
        }
      ]
    })

    // Commande 1 pour Pierre Laroche (sans sucre + sans lactose) - en préparation
    const order1Pierre = await prisma.order.create({
      data: {
        userId: clientPierreLaroche.id,
        customerName: 'Pierre LAROCHE',
        customerEmail: 'pierre.laroche@demo.com',
        customerPhone: '0444555666',
        subtotal: 30.10, // (2 × 3.80) + 22.50 = 7.60 + 22.50
        taxAmount: 6.02, // 20% TVA sur 30.10
        discount: 0,
        total: 30.10, // 30.10 + 6.02
        status: OrderStatus.PREPARING,
        paymentMethod: 'Carte bancaire',
        paymentStatus: 'PAID',
        estimatedReady: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // +1.5h
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // -1 jour
      }
    })

    // Créer les items pour la commande 1 de Pierre
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order1Pierre.id,
          pastryId: muffinSansSucre.id,
          name: muffinSansSucre.name,
          quantity: 2,
          price: muffinSansSucre.price
        },
        {
          orderId: order1Pierre.id,
          pastryId: tarteCitron.id,
          name: tarteCitron.name,
          quantity: 1,
          price: tarteCitron.price
        }
      ]
    })

    // Commande 2 pour Pierre Laroche - commande récupérée
    const order2Pierre = await prisma.order.create({
      data: {
        userId: clientPierreLaroche.id,
        customerName: 'Pierre LAROCHE',
        customerEmail: 'pierre.laroche@demo.com',
        customerPhone: '0444555666',
        subtotal: 15.30, // (2 × 1.80) + 2.80 + 8.90 = 3.60 + 2.80 + 8.90
        taxAmount: 3.06, // 20% TVA sur 15.30
        discount: 2.50,
        total: 10.20, // 15.30 + 3.06 - 2.50
        status: 'PICKED_UP' as any,
        paymentMethod: 'Carte bancaire',
        paymentStatus: 'PAID',
        estimatedReady: new Date(Date.now() - 4 * 60 * 60 * 1000), // -4h
        readyAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // -3.5h
        pickedUpAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // -3h
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // -5 jours
      }
    })

    // Créer les items pour la commande 2 de Pierre
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order2Pierre.id,
          pastryId: croissant.id,
          name: croissant.name,
          quantity: 2,
          price: croissant.price
        },
        {
          orderId: order2Pierre.id,
          pastryId: painAuChocolat.id,
          name: painAuChocolat.name,
          quantity: 1,
          price: painAuChocolat.price
        },
        {
          orderId: order2Pierre.id,
          pastryId: eclair.id,
          name: eclair.name,
          quantity: 1,
          price: eclair.price
        }
      ]
    })

    console.log('✅ Commandes')
  }

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
