import type { BookMeta } from '$lib/util/Story';

const baseRoute: string = '/books';

export let Books: { [key: string]: BookMeta } = {
  'Mixed Martial Hearts': {
    author: 'Sara Lufrano',
    authorDescription: 'Mixed Martial Hearts is Sara Rogers\' freshmen publication. She lives in Seattle, Washington with her family and adopted pets. She enjoys going to festivals and conventions, training her dog, and traveling.',
    bookLinks: [
      {
        image: '/Amazon_logo.svg',
        label: 'Paperback',
        url: 'https://www.amazon.com/Mixed-Martial-Hearts-Sara-Rogers/dp/B0BF31V262/ref=sr_1_1?crid=1AIXMJBPQ67SZ&keywords=mixed+martial+hearts&qid=1689195050&s=books&sprefix=mixed+martial+hearts%2Cstripbooks%2C247&sr=1-1',
      },
      {
        image: '/Amazon_Kindle_logo.svg',
        label: 'Kindle eBook',
        url: 'https://www.amazon.com/Mixed-Martial-Hearts-Sara-Rogers-ebook/dp/B0BF93GZX4/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=1689195050&sr=1-1',
      },
      {
        image: '/swlogo.png',
        label: 'Smashwords eBook',
        url: 'https://www.smashwords.com/books/view/1165784',
      },
    ],
    coverImage: '/books/mixed-martial-hearts.jpg',
    route: `${baseRoute}/Mixed Martial Hearts`,
    subtitle: 'A tale of love and MMA',
    synopsis: 'Emily and Matt were college lovers. After Matt\'s bad choices Emily left to focus on herself and her goals. Years later, since moving back to Santa Cruz, their home town, Matt and Emily can\'t seem to stay away from each other. Will they find a way to reconcile and be together or will Matt\'s actions keep them apart from each other forever?',
  },
  'Press Start for Love': {
    author: 'Sara Lufrano',
    authorDescription: 'Sara Rogers lives in Seattle, Washington with her family and adopted pets. She enjoys going to festivals and conventions, training her dog, and traveling.',
    bookLinks: [
      {
        image: '/Amazon_logo.svg',
        label: 'Paperback',
        url: 'https://www.amazon.com/dp/B0CJDDKSS4/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=',
      },
      {
        image: '/Amazon_Kindle_logo.svg',
        label: 'Kindle eBook',
        url: 'https://www.amazon.com/Press-Start-Love-Sara-Rogers-ebook/dp/B0CJD99KVP/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr=',
      },
      {
        image: '/swlogo.png',
        label: 'Smashwords eBook',
        url: 'https://www.smashwords.com/books/view/1451808',
      },
    ],
    coverImage: '/books/press-start-for-love.jpg',
    route: `${baseRoute}/Press Start for Love`,
    subtitle: 'Gaming for the Heart',
    synopsis: 'Anna Brier doesn\'t think esports is a sport but she\'s been re-assigned to report on a multi-city pro-gaming tournament. After meeting Paul, one of the top three gamers in the country, her opinions of esports might just change.',
  },
};
