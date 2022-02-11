const { S3 } = require('aws-sdk')
const md5 = require('md5')
const http = require('http')
const updateItems = require('./items')
const updateChamps = require('./champs')

const CHAMP = new URL(
	'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json'
)

const ITEMS = new URL(
	'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/items.json'
)

const get = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                resolve(data)
            })
            res.on('error', (err) => reject(err))
        })
    })
}

const needToUpdate = async () => {
    try {
        const s3 = new S3()
        const BUCKET = 'lol-forge'
        const [itemData, champData] = await Promise.all([get(ITEMS), get(CHAMP)])
        const [itemD5, champD5] = [md5(itemData), md5(champData)]
        const [itemProm, champProm] = await Promise.all([
                s3.getObject({ Bucket: BUCKET, Key: 'itemD5.txt' }).promise(),
                s3.getObject({ Bucket: BUCKET, Key: 'champD5.txt' }).promise(),
            ])
        const [itemDbV, champDbV] = [itemProm.Body?.toString('utf-8').trim(), champProm.Body?.toString('utf-8').trim()]
        console.log(itemDbV, champDbV)
        console.log(itemD5, champD5)
        let [itemResult, champResult] = [true, true]
        if (itemDbV !== itemD5) {
            console.log('item md5s didnt match, updating items')
            const parsedItems = JSON.parse(itemData)
            itemResult = await updateItems(parsedItems)
            if (itemResult) {
                await s3
                    .putObject({ Bucket: BUCKET, Key: 'itemD5.txt', Body: itemD5 })
                    .promise()
            } else {
                throw new Error('Failed to update items')
            }
        }
        if (champDbV !== champD5) {
            console.log('champ md5s didnt match, updating champs')
            const parsedChamps = JSON.parse(champData)
            champResult = await updateChamps(parsedChamps)
            if (champResult) {
                await s3
                    .putObject({ Bucket: BUCKET, Key: 'champD5.txt', Body: champD5 })
                    .promise()
            } else {
                throw new Error('failed to update champs')
            }
        }
        return [itemResult, champResult]
    } catch (e) {
        console.error(e)
        return [false, false]
    }
}

const updater = () => {
    return new Promise((resolve, reject) => {
        needToUpdate()
            .then(arr => {
                console.log('results:')
                console.log(arr)
                if (!arr[0] || !arr[1]) {
                    reject(`Updated items: ${arr[0]}\nUpdated champs: ${arr[1]}`)
                    return
                }
                resolve(`Updated items: ${arr[0]}\nUpdated champs: ${arr[1]}`)
            })
            .catch(() => reject('Unknown update error'))
    })
}

module.exports = updater