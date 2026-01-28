// Movie and TV show data
const moviesData = {
    "movies": [{
            "id": 1,
            "title": "Pearl",
            "year": 2022,
            "genre": "Horror, Drama",
            "imdb": 7.0,
            "description": "In 1918, a young woman living on her parents' farm dreams of a life beyond the countryside, but must face the darkness within herself.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNDYzMjkxMDMtY2M5NC00NWNhLWEwMDMtMjgyMDIwMzFmMGVlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/_WEFCGWIyEg"
        },
        {
            "id": 2,
            "title": "X",
            "year": 2022,
            "genre": "Horror, Thriller",
            "imdb": 6.6,
            "description": "In 1979, a group of young filmmakers set out to make an adult film in rural Texas, but when their elderly hosts catch them, the cast finds themselves fighting for their lives.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTJiMmE5YWItOWZjYS00YTg0LWE0MTYtMzg2ZTY4YjNkNDEzXkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/A_39sLPS8dw"
        },
        {
            "id": 3,
            "title": "MaXXXine",
            "year": 2024,
            "genre": "Horror, Thriller",
            "imdb": 6.5,
            "description": "In 1980s Hollywood, adult film star Maxine Minx finally gets her big break, but a mysterious killer stalks the starlets of Los Angeles.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMGYwNGZhMDItYWFlMy00YmM4LWEzZTUtOWUxMWM3ZTU4MDRiXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/oE2Cn28HD_4"
        },
        {
            "id": 4,
            "title": "The Shining",
            "year": 1980,
            "genre": "Horror, Thriller",
            "imdb": 8.4,
            "description": "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/5Cb3ik6zP2I"
        },
        {
            "id": 5,
            "title": "Pulp Fiction",
            "year": 1994,
            "genre": "Crime, Drama",
            "imdb": 8.9,
            "description": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/s7EdQ4FqbhY"
        },
        {
            "id": 6,
            "title": "The Shape of Water",
            "year": 2017,
            "genre": "Fantasy, Drama, Romance",
            "imdb": 7.3,
            "description": "At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNGNiNWQ5M2MtNGI0OC00MjM5LTk0MDctMzk0NmNjNTBiZWZiXkEyXkFqcGdeQXVyMzI2OTUxMTM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/RPC8pPZjqqE"
        },
        {
            "id": 7,
            "title": "Pan's Labyrinth",
            "year": 2006,
            "genre": "Fantasy, Drama, War",
            "imdb": 8.2,
            "description": "In the Falangist Spain of 1944, a bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTU3ODg2NjQ5NF5BMl5BanBnXkFtZTcwMDEwODgzMQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/EqYeJGKHaOw"
        },
        {
            "id": 8,
            "title": "Kung Fu Hustle",
            "year": 2004,
            "genre": "Action, Comedy, Crime",
            "imdb": 7.8,
            "description": "In Shanghai during the 1940s, a wannabe gangster aspires to join the notorious Axe Gang while residents of a housing complex exhibit extraordinary powers.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNjM3MTk5NjMwNV5BMl5BanBnXkFtZTYwNjk0MzM0._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/XEFr-91k1R0"
        },
        {
            "id": 9,
            "title": "The Grand Budapest Hotel",
            "year": 2014,
            "genre": "Comedy, Drama",
            "imdb": 8.1,
            "description": "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under a legendary concierge.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/1Fg5iWmQjwk"
        },
        {
            "id": 10,
            "title": "My Neighbor Totoro",
            "year": 1988,
            "genre": "Animation, Family, Fantasy",
            "imdb": 8.1,
            "description": "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYWM3MDE3YjEtMzIzZC00ODE5LTgxNTItNmUyMTBkM2M2NmNiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/92a7Hj0ijLs"
        },
        {
            "id": 11,
            "title": "The Life Aquatic with Steve Zissou",
            "year": 2004,
            "genre": "Adventure, Comedy, Drama",
            "imdb": 7.2,
            "description": "With a plan to exact revenge on a mythical shark that killed his partner, oceanographer Steve Zissou rallies a crew that includes his estranged wife, a journalist, and a man who may be his son.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTYxMDkxNTI4NF5BMl5BanBnXkFtZTYwNDc0NzM3._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/yh6CLf45RMw"
        },
        {
            "id": 12,
            "title": "It's a Wonderful Life",
            "year": 1946,
            "genre": "Drama, Family, Fantasy",
            "imdb": 8.6,
            "description": "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZjc4NDZhZWMtNGEzYS00ZWU2LThlM2ItNTA0YzQ0OTExMTE2XkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/iLR3gZrU2Xo"
        },
        {
            "id": 13,
            "title": "Spirited Away",
            "year": 2001,
            "genre": "Animation, Family, Fantasy",
            "imdb": 8.6,
            "description": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/ByXuk9QqQkk"
        },
        {
            "id": 14,
            "title": "Parasite",
            "year": 2019,
            "genre": "Drama, Thriller",
            "imdb": 8.5,
            "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/5xH0HfJHsaY"
        },
        {
            "id": 15,
            "title": "The Menu",
            "year": 2022,
            "genre": "Comedy, Horror, Thriller",
            "imdb": 7.2,
            "description": "A couple travels to a coastal island to eat at an exclusive restaurant where the chef has prepared a lavish menu, with some shocking surprises.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjkxNjI5NDM1M15BMl5BanBnXkFtZTgwNzY0NTgzNzM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/C_uTkUGcHv4"
        },
        {
            "id": 16,
            "title": "Life of Pi",
            "year": 2012,
            "genre": "Adventure, Drama, Fantasy",
            "imdb": 7.9,
            "description": "A young man who survives a disaster at sea is hurtled into an epic journey of adventure and discovery. While cast away, he forms an unexpected connection with another survivor: a fearsome Bengal tiger.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNTg2OTY2ODg5OF5BMl5BanBnXkFtZTcwODM5MTYxOA@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/j9Hjrs6_n8w"
        },
        {
            "id": 17,
            "title": "Isle of Dogs",
            "year": 2018,
            "genre": "Animation, Adventure, Comedy",
            "imdb": 7.8,
            "description": "Set in Japan, Isle of Dogs follows a boy's odyssey in search of his lost dog on a trash island populated by dogs that were banished by a corrupt mayor.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYmNmYzFkM2YtMjE5Yy00MDBmLWI1ZDQtYjQ0YzAwZGUxZGQxXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/dt__kig8PVU"
        },
        {
            "id": 18,
            "title": "Fight Club",
            "year": 1999,
            "genre": "Drama, Thriller",
            "imdb": 8.8,
            "description": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/BdJKm16Co6M"
        },
        {
            "id": 19,
            "title": "Chicago",
            "year": 2002,
            "genre": "Comedy, Crime, Musical",
            "imdb": 7.2,
            "description": "Two death-row murderesses develop a fierce rivalry while competing for publicity, celebrity, and a sleazy lawyer's attention.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjEyNzkwNjI4OF5BMl5BanBnXkFtZTYwNzk3Mjk3._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/YxzJUozCCpI"
        },
        {
            "id": 20,
            "title": "Her",
            "year": 2013,
            "genre": "Drama, Romance, Sci-Fi",
            "imdb": 8.0,
            "description": "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjA1Nzk0OTM2OF5BMl5BanBnXkFtZTgwNjU2NjEwMDE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/dJTU48_yghs"
        },
        {
            "id": 21,
            "title": "Once Upon a Time in Hollywood",
            "year": 2019,
            "genre": "Comedy, Drama",
            "imdb": 7.6,
            "description": "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age in 1969 Los Angeles.",
            "poster": "https://m.media-amazon.com/images/M/MV5BOTg4ZTNkZmUtMzNlZi00YmFjLTk1MmUtNWQwNTM0YjcyNTNkXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/ELeMaP8EPAA"
        },
        {
            "id": 22,
            "title": "Django Unchained",
            "year": 2012,
            "genre": "Drama, Western",
            "imdb": 8.5,
            "description": "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/0fUCuvNlOCg"
        },
        {
            "id": 23,
            "title": "Fury",
            "year": 2014,
            "genre": "Action, Drama, War",
            "imdb": 7.6,
            "description": "A grizzled tank commander makes tough decisions as he and his crew fight their way across Germany in April 1945.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjA4MDU0NTUyN15BMl5BanBnXkFtZTgwMzQxMzY4MTE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/DNJXaFVoZuc"
        },
        {
            "id": 24,
            "title": "Inglourious Basterds",
            "year": 2009,
            "genre": "Drama, Action, War",
            "imdb": 8.4,
            "description": "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.",
            "poster": "https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/KnrRy6kSFF0"
        },
        {
            "id": 25,
            "title": "Arrival",
            "year": 2016,
            "genre": "Drama, Sci-Fi, Mystery",
            "imdb": 7.9,
            "description": "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/tFMo3UJ4B4g"
        },
        {
            "id": 26,
            "title": "The Irishman",
            "year": 2019,
            "genre": "Biography, Crime, Drama",
            "imdb": 7.8,
            "description": "An old hitman recalls his possible involvement with the slaying of Jimmy Hoffa and his journey through the ranks of organized crime.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMGUyM2ZiZmUtMWY0OC00NTQ4LThkOGUtNjY2NjkzMDJiMWI0XkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/WHXxVmeq6gU"
        },
        {
            "id": 27,
            "title": "Monty Python's Life of Brian",
            "year": 1979,
            "genre": "Comedy",
            "imdb": 8.0,
            "description": "Born on the original Christmas in the stable next door to Jesus Christ, Brian of Nazareth spends his life being mistaken for a messiah.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMDA2YjYzN2EtNGUyNS00ZmYzLTllZDItYzI1MjE5NjNhNjc4XkEyXkFqcGdeQXVyNzY1MDk4MDU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/ZYMqejndUe0"
        },
        {
            "id": 28,
            "title": "Palm Springs",
            "year": 2020,
            "genre": "Comedy, Romance, Sci-Fi",
            "imdb": 7.4,
            "description": "Stuck in a time loop, two wedding guests develop a budding romance while living the same day over and over again.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNmRiMDM0NTQtZTk4ZC00OWQ0LTkyNGUtZjBhYmJhNmY0NWNkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/CpBLtXduh_k"
        },
        {
            "id": 29,
            "title": "Elite Squad",
            "year": 2007,
            "genre": "Action, Crime, Drama",
            "imdb": 8.0,
            "description": "In 1997 Rio de Janeiro, Captain Nascimento has to find a substitute for his position while trying to take down drug dealers and criminals before the Pope visits.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTU4OTczNzExOV5BMl5BanBnXkFtZTcwNDc4NzYyMw@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/Bp5wKWYFm2o"
        },
        {
            "id": 30,
            "title": "The Shawshank Redemption",
            "year": 1994,
            "genre": "Drama",
            "imdb": 9.3,
            "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/6hB3S9bIaco"
        },
        {
            "id": 31,
            "title": "The Boy in the Striped Pyjamas",
            "year": 2008,
            "genre": "Drama, War",
            "imdb": 7.7,
            "description": "Through the innocent eyes of Bruno, the eight-year-old son of the commandant at a concentration camp, a forbidden friendship with a Jewish boy on the other side of the camp fence has startling consequences.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTM2MzQ4NDY4NV5BMl5BanBnXkFtZTcwMDg0MzQ4MQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/9ypMp0s5Hiw"
        },
        {
            "id": 32,
            "title": "Cinema Paradiso",
            "year": 1988,
            "genre": "Drama, Romance",
            "imdb": 8.5,
            "description": "A filmmaker recalls his childhood when falling in love with the pictures at the cinema of his home village and forms a deep friendship with the cinema's projectionist.",
            "poster": "https://m.media-amazon.com/images/M/MV5BM2FhYjEyYmYtMDI1Yy00YTdlLWI2NWQtYmEzNzAxOGY1NjY2XkEyXkFqcGdeQXVyNTA3NTIyNDg@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/gvxHKf6_OwU"
        },
        {
            "id": 33,
            "title": "The Beach",
            "year": 2000,
            "genre": "Adventure, Drama, Thriller",
            "imdb": 6.6,
            "description": "On vacation in Thailand, Richard sets out for an island rumored to be a solitary beach paradise, but discovers that the commune residing there is not as idyllic as it seems.",
            "poster": "https://m.media-amazon.com/images/M/MV5BN2ViYTFiZmUtMTMxYy00ZWNiLWJhOTQtYjA5YmI3OTYxYzZlXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/GGiGJFjZlAE"
        },
        {
            "id": 34,
            "title": "Blade Runner",
            "year": 1982,
            "genre": "Sci-Fi, Thriller",
            "imdb": 8.1,
            "description": "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/gCcx85zbxz4"
        }
    ],

    "tvShows": [{
            "id": 101,
            "title": "Better Call Saul",
            "year": "2015-2022",
            "genre": "Crime, Drama",
            "imdb": 9.0,
            "description": "The trials and tribulations of criminal lawyer Jimmy McGill before his fateful transformation into Saul Goodman. Features a shocking final season.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZDA4YmE0OTYtMmRmNS00Mzk2LTlhM2MtNjk4NzBjZGE1MmIyXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/HN4oydykJFc"
        },
        {
            "id": 102,
            "title": "Bob's Burgers",
            "year": "2011-",
            "genre": "Animation, Comedy",
            "imdb": 8.2,
            "description": "Bob Belcher runs his dream restaurant with his wife and three children as their last hope of holding the family together.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTQxNzE2OTU5M15BMl5BanBnXkFtZTgwMzU4MDcxNzE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/IBDJF4EryN0"
        },
        {
            "id": 103,
            "title": "The IT Crowd",
            "year": "2006-2013",
            "genre": "Comedy",
            "imdb": 8.5,
            "description": "The comedic misadventures of Roy, Moss and their grifting supervisor Jen, a rag-tag team of IT support workers at a large corporation in London.",
            "poster": "https://m.media-amazon.com/images/M/MV5BN2E0NmY1ZDgtN2M0YS00NTgyLTkyYzMtYWM5YzZjNDFhMTA5XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/OBHPjKoCmKw"
        },
        {
            "id": 104,
            "title": "Silicon Valley",
            "year": "2014-2019",
            "genre": "Comedy",
            "imdb": 8.5,
            "description": "Follows the struggle of Richard Hendricks, a Silicon Valley engineer trying to build his own company called Pied Piper.",
            "poster": "https://m.media-amazon.com/images/M/MV5BOTMyMjcxMjEtZTA1Zi00ZTkxLWI2YzAtYjViNzNkNDJmOGY5XkEyXkFqcGdeQXVyMTAzMDM4MjM0._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/69V__a49xtw"
        },
        {
            "id": 105,
            "title": "Avatar: The Last Airbender",
            "year": "2005-2008",
            "genre": "Animation, Action, Adventure",
            "imdb": 9.3,
            "description": "In a war-torn world of elemental magic, a young boy reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar.",
            "poster": "https://m.media-amazon.com/images/M/MV5BODc5YTBhMTItMjhkNi00ZTIxLWI0YjAtNTZmOTY0YjRlZGQ0XkEyXkFqcGdeQXVyODUwNjEzMzg@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/d1EnW4kn1kg"
        },
        {
            "id": 106,
            "title": "True Detective",
            "year": "2014-",
            "genre": "Crime, Drama, Mystery",
            "imdb": 8.9,
            "description": "Seasonal anthology series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMmRlYmE0Y2UtNDkwYy00NDQxLTg2YzAtZWVhMzI4NWI1ZTdmXkEyXkFqcGdeQXVyNTMxMjgxMzg@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/fVQUcaO4AvE"
        },
        {
            "id": 107,
            "title": "Fargo",
            "year": "2014-",
            "genre": "Crime, Drama, Thriller",
            "imdb": 8.9,
            "description": "Various chronicles of deception, intrigue and murder in and around frozen Minnesota. All of these tales mysteriously lead back one way or another to Fargo, North Dakota.",
            "poster": "https://m.media-amazon.com/images/M/MV5BN2NiMGE5MGQtNjlhYy00NzJmLWE4NTktMzg3N2JmNzI0ZTk4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/gKs8DzjPDMU"
        },
        {
            "id": 108,
            "title": "Parks and Recreation",
            "year": "2009-2015",
            "genre": "Comedy",
            "imdb": 8.6,
            "description": "The absurd antics of an Indiana town's public officials as they pursue sundry projects to make their city a better place.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjBjZGFiNDgtYzE4MS00NDk0LWIyMTktNjU4OGQ0YWJlN2E5XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/Ds6lc2BYmZ4"
        },
        {
            "id": 109,
            "title": "Derry Girls",
            "year": "2018-2022",
            "genre": "Comedy",
            "imdb": 8.5,
            "description": "The personal exploits of a 16-year-old girl and her family and friends during the Troubles in the early 1990s in Northern Ireland.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYjJkMTMxYjAtYzBlZC00MDc3LWIxYjYtYzQ1MTI5MDY4YjJlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/k0lZF5hHhH8"
        },
        {
            "id": 110,
            "title": "The Great",
            "year": "2020-2023",
            "genre": "Comedy, Drama, History",
            "imdb": 8.1,
            "description": "A royal woman living in rural Russia during the 18th century is forced to choose between her own personal happiness and the future of Russia.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTg3MjkyMDU3NV5BMl5BanBnXkFtZTgwMzIzMTk1NzM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/giOBRKR3wXk"
        },
        {
            "id": 111,
            "title": "The Office",
            "year": "2005-2013",
            "genre": "Comedy",
            "imdb": 9.0,
            "description": "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4MTktYTJhMmY0NWUwZjQ0XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/LHOtME2DL4g"
        },
        {
            "id": 112,
            "title": "House of Guinness",
            "year": "2025",
            "genre": "Drama, History",
            "imdb": 7.8,
            "description": "A lavish drama series chronicling the lives, loves, and scandals of the famous Guinness brewing dynasty.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYjA0N2I3NzUtNjZiZC00YTY4LWI4OTctNDkzNWVlODQ0Yjg4XkEyXkFqcGdeQXVyMTE1NTE2MjE2._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/W3l0kgNy8pw"
        },
        {
            "id": 113,
            "title": "Brooklyn Nine-Nine",
            "year": "2013-2021",
            "genre": "Comedy, Crime",
            "imdb": 8.4,
            "description": "Comedy series following the exploits of Det. Jake Peralta and his diverse, lovable colleagues as they police the NYPD's 99th Precinct.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNzVkYWY4NzYtMWFlZi00YzkwLThhZDItZjcxYTU4ZTMzMDZmXkEyXkFqcGdeQXVyODUxOTU0OTg@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/sJWYzLPVPQM"
        },
        {
            "id": 114,
            "title": "Rick and Morty",
            "year": "2013-",
            "genre": "Animation, Comedy, Sci-Fi",
            "imdb": 9.1,
            "description": "An animated series that follows the exploits of a super scientist and his not-so-bright grandson on interdimensional adventures.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZjRjOTFkOTktZWUzMi00YzMyLThkMmYtMjEwNmQyNzliYTNmXkEyXkFqcGdeQXVyNzQ1ODk3MTQ@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/WNhH00CTRNQ"
        },
        {
            "id": 115,
            "title": "Futurama",
            "year": "1999-2013",
            "genre": "Animation, Comedy, Sci-Fi",
            "imdb": 8.5,
            "description": "Philip J. Fry, a pizza delivery boy, is accidentally frozen in 1999 and thawed out on New Year's Eve 2999.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNzQxMjYyMjQtZDZhNC00ODJlLTlkMTctMjY0OGUwYTYyZGI0XkEyXkFqcGdeQXVyMTA1OTEwNjE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/2JkCeM4BEwY"
        },
        {
            "id": 116,
            "title": "The Sopranos",
            "year": "1999-2007",
            "genre": "Crime, Drama",
            "imdb": 9.2,
            "description": "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZGJjYzhjYTYtMDBjYy00OWU1LTg5OTYtNmYwOTZmZjE3ZDdhXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/KMx4iFcozK0"
        },
        {
            "id": 117,
            "title": "Lost",
            "year": "2004-2010",
            "genre": "Adventure, Drama, Mystery",
            "imdb": 8.3,
            "description": "The survivors of a plane crash are forced to work together in order to survive on a seemingly deserted tropical island.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNzhlY2E5NDUtYjJjYy00ODIwLTg5YzQtYjEyZjJkNmRjMjg2XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/KTu8iDynwNc"
        },
        {
            "id": 118,
            "title": "Dexter",
            "year": "2006-2013",
            "genre": "Crime, Drama, Mystery",
            "imdb": 8.6,
            "description": "By day he's a blood spatter pattern expert for the Miami Metro Police. But by night, he takes on an entirely different persona: serial killer.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZjkzMmU5MjMtODllZS00OTA5LTk2ZTEtNjdhYjZhMDA5ZTRhXkEyXkFqcGdeQXVyOTA3MTI2NTc@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/YQeUmSD1c3g"
        },
        {
            "id": 119,
            "title": "House M.D.",
            "year": "2004-2012",
            "genre": "Drama, Mystery",
            "imdb": 8.7,
            "description": "An antisocial maverick doctor who specializes in diagnostic medicine does whatever it takes to solve puzzling cases that come his way.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMDA4NjQzN2ItZDhhNC00ZjVlLWFjNTgtMTEyNDQyOGNjMDE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/cRpLdF8Ea8s"
        },
        {
            "id": 120,
            "title": "Chernobyl",
            "year": 2019,
            "genre": "Drama, History, Thriller",
            "imdb": 9.3,
            "description": "In April 1986, an explosion at the Chernobyl nuclear power plant becomes one of the world's worst man-made catastrophes.",
            "poster": "https://m.media-amazon.com/images/M/MV5BNTEyODlmODgtYjcxMi00ZTM5LTk3NzAtMTVlMmQxOWMyOGJiXkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/s9APLXM9Ei8"
        },
        {
            "id": 121,
            "title": "Ted Lasso",
            "year": "2020-2023",
            "genre": "Comedy, Drama, Sport",
            "imdb": 8.8,
            "description": "American football coach Ted Lasso heads to London to manage AFC Richmond, a struggling English Premier League soccer team.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMDVmOGIwMWEtZTI0ZC00YmQ0LWIzNzYtOGUxZGExNDdhMjU5XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/_rXqSGwyTGU"
        },
        {
            "id": 122,
            "title": "Severance",
            "year": "2022-",
            "genre": "Drama, Mystery, Sci-Fi",
            "imdb": 8.7,
            "description": "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMzZmMWFlOGQtZjNiNS00ZGQ2LTkzZjQtZjVmZDJhZTg3NTU3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/xEQP4VVuyrY"
        },
        {
            "id": 123,
            "title": "Emily in Paris",
            "year": "2020-",
            "genre": "Comedy, Drama, Romance",
            "imdb": 6.8,
            "description": "A young American woman from the Midwest is hired by a marketing firm in Paris to provide them with an American perspective on things.",
            "poster": "https://m.media-amazon.com/images/M/MV5BOTJjMDNlZmUtOTE3NS00NWQxLTlhZDEtNTE2ZmVlODZiYWM1XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/lptctjAT-Mk"
        },
        {
            "id": 124,
            "title": "Arcane",
            "year": "2021-",
            "genre": "Animation, Action, Adventure",
            "imdb": 9.0,
            "description": "Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League Of Legends champions.",
            "poster": "https://m.media-amazon.com/images/M/MV5BYmU5OWM5ZTAtNjUzOC00NmUyLTgyOWMtMjlkNjdlMDAzMzU1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/4Ps6nV4wiCE"
        },
        {
            "id": 125,
            "title": "Love, Death & Robots",
            "year": "2019-",
            "genre": "Animation, Sci-Fi, Horror",
            "imdb": 8.4,
            "description": "A collection of animated short stories that span various genres including science fiction, fantasy, horror and comedy.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMTc1MjIyNDI3Nl5BMl5BanBnXkFtZTgwMjQ1OTI0NzM@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/wUFwunMKa4E"
        },
        {
            "id": 126,
            "title": "Shameless",
            "year": "2011-2021",
            "genre": "Comedy, Drama",
            "imdb": 8.5,
            "description": "A scrappy, fiercely loyal Chicago family makes no apologies as they survive life in the margins of contemporary America.",
            "poster": "https://m.media-amazon.com/images/M/MV5BMjMyOTM3MjY2Ml5BMl5BanBnXkFtZTgwODI4OTcwMTE@._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/bvdQaCHZV0M"
        },
        {
            "id": 127,
            "title": "Shōgun",
            "year": 2024,
            "genre": "Drama, History, War",
            "imdb": 8.7,
            "description": "An English navigator becomes both a player and pawn in the complex political games in feudal Japan.",
            "poster": "https://m.media-amazon.com/images/M/MV5BZDU1MjFiYTQtZTA4Ni00ZmE5LTk4YWMtMGU1YzExYWEwNWYyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
            "trailer": "https://www.youtube.com/embed/f4t0mDAgP44"
        }
    ]
};