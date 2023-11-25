import type { ShortStoryMeta } from '$lib/util/Story';

const baseRoute: string = '/short-stories';
const title: string = 'Evil Glasses Short Stories: Edition';

export let Stories: { [key: number]: ShortStoryMeta } = {
  1: {
    name: `${title} 1`,
    date: '2015-07-01',
    edition: '01',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'A solitary woman dedicated to her labor-intensive life near a volcano encounters an unexpected visitor.',
        title: 'The Lava Farmer',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'A high school student begins experiencing horrifying encounters and inexplicable sickness following the death of her friend.',
        title: 'Anorexia',
      },
    ],
    route: `${baseRoute}/2015-07-01/01/`
  },
  2: {
    name: `${title} 2`,
    date: '2015-10-01',
    edition: '02',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'A young boy inherits a supernatural ability and must learn to use his unique power.',
        title: 'Plane Jumper',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A scientist releases a bioengineered beast to evade an armed group, facing repercussions from his partner and risking global danger.',
        title: 'Sharkrilla',
      },
    ],
    route: `${baseRoute}/2015-10-01/02/`
  },
  3: {
    name: `${title} 3`,
    date: '2016-01-01',
    edition: '03',
    stories: [
      {
        author: 'Mike Kirkendall',
        synopsis: 'In a troll-infested, post-apocalyptic world, an insurance agent grapples with perilous conditions and deceptive policy terms to verify a client\'s death.',
        title: 'EOW Insurance',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'On a journey to the moon, two people share an intimate encounter as they grapple with their future in the new lunar colony.',
        title: 'Elevator to the Moon',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'A couple grapples with ethical questions about the potential of human cloning after a rockclimbing accident.',
        title: 'Cloned',
      },
    ],
    route: `${baseRoute}/2016-01-01/03/`
  },
  4: {
    name: `${title} 4`,
    date: '2016-04-01',
    edition: '04',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'An adult man catfishes his father to find evidence of adultery.',
        title: 'Fishing Trip',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A man obsessively contemplates reaching out to his ex while ignoring his current partner.',
        title: 'Call',
      },
    ],
    route: `${baseRoute}/2016-04-01/04/`
  },
  5: {
    name: `${title} 5`,
    date: '2016-07-01',
    edition: '05',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'Two friends share a unique experience watching mysterious phenomena in the sky.',
        title: 'Capital Hill',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'Caught between age-old myths and harsh survival, a young man defies all odds to protect humanity\'s last stand against the advice of his elders.',
        title: 'Sleeping Gods',
      },
    ],
    route: `${baseRoute}/2016-07-01/05/`
  },
  6: {
    name: `${title} 6`,
    date: '2016-10-01',
    edition: '06',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'In a world where AI justice reigns supreme, a lawyer\'s quest for the perfect life score collides with humanity\'s stark reality when he\'s tasked to defend the very creator of the omnipotent AI.',
        title: 'Crimes Against Silicon',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A comic\'s onstage struggle with the right punchline parallels her offstage pursuit of an out- of - reach love.',
        title: 'The Bad Comic',
      },
    ],
    route: `${baseRoute}/2016-10-01/06/`
  },
  7: {
    name: `${title} 7`,
    date: '2017-01-01',
    edition: '07',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'Embark on a thrilling cosmic journey where an unexpected encounter with sentient matter propels an explorer fleet starship into a high- stakes battle.',
        title: 'Captain\'s Log',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'A clash of reality and gaming where the stakes are more personal than anyone could have anticipated - a battle for bodily autonomy in a world that demands the unthinkable.',
        title: 'Miss Conception',
      },
    ],
    route: `${baseRoute}/2017-01-01/07/`
  },
  8: {
    name: `${title} 8`,
    date: '2017-04-01',
    edition: '08',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'A tale of distorted reality where human bonds and rock concerts take a sinister twist, where crowds are to be feared.',
        title: 'Crowds',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A chilling tale of sleepless nights and haunting melodies, where love is tested by a mystery that turns every dream into a waking nightmare.',
        title: '12th Ave North, Unit M',
      },
    ],
    route: `${baseRoute}/2017-04-01/08/`
  },
  9: {
    name: `${title} 9`,
    date: '2017-07-01',
    edition: '09',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'An exploration of failed aspirations, self-doubt, and the bittersweet humor found within the disappointments of everyday life of a standup comic.',
        title: 'The Bad Comic, Episode 2',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'A night of cat-sitting goes wrong.',
        title: 'Night of the Cat',
      },
    ],
    route: `${baseRoute}/2017-07-01/09/`
  },
  10: {
    name: `${title} 10`,
    date: '2017-10-01',
    edition: '10',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'A woman must travel back in time to stop a bio-terrorist.',
        title: 'Transformations',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A quiet crisis of a woman caught in the crossfire of her desires and duties.',
        title: 'Moment in Time',
      },
    ],
    route: `${baseRoute}/2017-10-01/10/`
  },
  11: {
    name: `${title} 11`,
    date: '2018-01-01',
    edition: '11',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'A tale of loss and redemption, where love lives in every grain of wood and in the heart of a man finding his way back to life.',
        title: 'Glasswood Chest',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'A journey of souls, transcending time and space, as they dance on the edge of eternity.',
        title: 'Memories of the End',
      },
    ],
    route: `${baseRoute}/2018-01-01/11/`
  },
  12: {
    name: `${title} 12`,
    date: '2018-04-01',
    edition: '12',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'A high-ranking executive tired of constant agreement from his peers seeks enlightenment from a dominatrix.',
        title: 'Prostitute',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'Two men struggle with the meaning of their lives while working a grueling job creating a firebreak.',
        title: 'A Hot Week in August',
      },
    ],
    route: `${baseRoute}/2018-04-01/12/`
  },
  13: {
    name: `${title} 13`,
    date: '2018-07-01',
    edition: '13',
    stories: [
      {
        author: 'Sara Lufrano',
        synopsis: 'A poignant exploration of eternal love and the heartrending journey of a ghost clinging to the world of the living.',
        title: 'I Died',
      },
      {
        author: 'Marshall Bowles',
        synopsis: 'In a post-apocalyptic world, a robotic caretaker diligently maintains a dog shelter in the face of danger.',
        title: 'No Kill Shelter',
      },
    ],
    route: `${baseRoute}/2018-07-01/13/`
  },
  14: {
    name: `${title} 14`,
    date: '2019-03-01',
    edition: '14',
    stories: [
      {
        author: 'Marshall Bowles',
        synopsis: 'A proposal for a new form of targeted advertising turns out to be unethical in more ways than one.',
        title: 'Advertisment Help!',
      },
      {
        author: 'Sara Lufrano',
        synopsis: 'A tale of the complexities of relationships and the pain of letting go.',
        title: 'Two',
      }
    ],
    route: `${baseRoute}/2019-03-01/14/`
  }
}
