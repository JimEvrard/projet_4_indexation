import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import Util from './utils/util.js'

const app = express();

app.use(express.static('./assets'));
app.use(express.json());
app.use(express.urlencoded(
    {
        extended: true
    }));
app.listen(8082, () => {
    console.clear();
    console.log("listen on http://localhost:8082");
});

app.get('/', (req, res) => {
    let sites_arr;

    try {
        sites_arr = JSON.parse(fs.readFileSync('./data/sites.json'));
    } catch (error) {
        console.log('Data not exist. Creating data file.');
        sites_arr = [];
    }
    const arr_of_urls = [];
    sites_arr.forEach(site => {
        arr_of_urls.push(site.url);
    })

    res.render('indexation.html.twig', { arr: arr_of_urls });

});

app.get('/search', (req, res) => {
    res.render('search.html.twig');
});

app.post('/', async (req, res) => {
    const url = req.body.url;

    if (url === '') {
        let sites_arr;

        try {
            sites_arr = JSON.parse(fs.readFileSync('./data/sites.json'));
        } catch (error) {
            console.log('Data not exist. Creating data file.');
            sites_arr = [];
        }
        const arr_of_urls = [];
        sites_arr.forEach(site => {
            arr_of_urls.push(site.url);
        })

        res.render('indexation.html.twig', { arr: arr_of_urls });

    } else {

        const body = await fetch(url);
        const text_html = await body.text();

        const $ = cheerio.load(text_html);

        const text = $('body').text();
        const title = $('title').text();

        const arr = text.split(/[ ',.?!/\t\n-:·–—«»@$€=;]/g);

        const clean_arr = [];

        arr.forEach(word => {
            if (word != '' && word.length > 3 && word.length < 20) {
                clean_arr.push(word.toLowerCase());
            }
        })

        let sites_arr;

        const site_obj = {
            url: url,
            title: title,
            words: Util.count_words(clean_arr)
        };

        try {
            sites_arr = JSON.parse(fs.readFileSync('./data/sites.json'));
        } catch (error) {
            console.log('Data not exist. Creating data file.');
            sites_arr = [];
        }

        if (sites_arr.length === 0) {
            sites_arr.push(site_obj);
        } else {
            let exist = false
            sites_arr.forEach(site => {
                if (site.title === title) {
                    exist = true;
                }
            })
            if (!exist) {
                sites_arr.push(site_obj);
            }
        }

        fs.writeFileSync('./data/sites.json', JSON.stringify(sites_arr));

        const arr_of_urls = [];
        sites_arr.forEach(site => {
            arr_of_urls.push(site.url);
        })

        res.render('indexation.html.twig', { arr: arr_of_urls });
    }
})


app.post('/search', (req, res) => {
    const word = req.body.word;
    if (word !== '') {
        let sites_arr;
        let sort_sites_arr = [];
        try {
            sites_arr = JSON.parse(fs.readFileSync('./data/sites.json'));
        } catch (error) {
            console.log('Data not exist. Creating data file.');
            sites_arr = [];
        }
        sites_arr.forEach(site => {
            let site_url = site.url;
            let word_count = 0;
            site.words.forEach(site_word => {
                if (site_word.word === word) {
                    word_count = site_word.count;
                }
            })
            sort_sites_arr.push({ site_url, word_count });
        });
        res.render('search.html.twig', {
            word: word, arr: sort_sites_arr.sort((a, b) => {
                return b.word_count - a.word_count
            })
        });

    } else {
        res.render('search.html.twig');
    }
})


app.post('/delete', (req, res) => {

    fs.unlink('./data/sites.json', () => { });
    res.render('indexation.html.twig');
});

app.get('/before', (req, res) => {
    res.render('before.html.twig');
});