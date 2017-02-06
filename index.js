function initialize() {
}

function onReceive(res) {
    api.slack.talk(res)
}

const patterns = [{
        re: /(つらい|しんどい|辛い|疲れた|つかれた)/,
        texts: [
            '今日はもう休んでも良いのよ。',
            'ゆっくり休んだ方がいいわ。',
            'ゴロゴロしてもいいのよ。',
            'ゆっくり寝ても良いのよ。',
            'いっぱい甘えてもいいのよ。'
        ]
    },{
        re: /(帰りたい|かえりたい)/,
        texts: [
            '帰っても良いのよ。',
            'さぁもう帰りましょう。'
        ]
    },{
        re: /(はらへった|腹減った|おなかすいた|お腹すいた)/,
        texts: [
            'ご飯用意しておくわ。ちょっと待っててね。',
            'さぁ、暖かいご飯を食べましょう。'
        ]
    }, {
        re: /(ただいま|帰った|かえった)/,
        texts: [
            'お帰りなさい。待ってたわよ。',
            'お帰りなさい。ゆっくり休んでね。',
            'お帰りなさい。お風呂にする？ご飯にする？それとも…？'
        ]
    }, {
        re: /ヴァアア|ｳﾞｧｱｱ/,
        texts: [
            '落ち着いて？大丈夫よ。まずは深呼吸しましょう。',
            '大丈夫よ、まずは深呼吸しましょう。',
            'すべて忘れて寝ても良いのよ。',
            '今日はもう休んじゃえばいいのよ。'
        ]
    }, {
        re: /(バブ|ばぶ|ママ)/,
        texts: [
            'あらあら、赤ちゃんね。かわいいわね。',
            '赤ちゃんなのね、仕方ないわね。甘えてもいいのよ。'
        ]
    }, {
        re: /[uU][rR][lL]/,
        text: [
            'http://samezi-but.com/botheaven/bots/8'
        ]
    }
]

const prefixs = [
    '大丈夫よ。',
    '今日もよく頑張ったわね。',
    '頑張ったわね。',
    'えらいわ！'
]

function ikaduti(name, text) {
    patterns.forEach(function(pattern) {
        if (pattern.re.exec(text)) {
            const prefix = prefixs[Math.floor(Math.random() * prefixs.length)]
            const message = pattern.texts[Math.floor(Math.random() * pattern.texts.length)]
            api.slack.talk(prefix + message)
            if (api.storage['amaenbo_' + name]) {
                api.storage['amaenbo_' + name]++
            } else {
                api.storage['amaenbo_' + name] = 1
            }
            return
        }
    })
}

function onTalk(name, text) {

    // api.http.get("https://api.github.com/repos/erukiti/waterslider/commits", {}, "onReceive")

    if (text === '甘えんぼ' || text === '甘えん坊') {
        api.storage.keys.forEach(function(key) {
            if (key.substr(0, 8) === 'amaenbo_') {
                const name = key.substr(8)
                const times = api.storage[key]

                api.slack.talk(name + 'は' + times + '回甘えたわ。')
            }
        })
        api.slack.talk('みんなもっと甘えてもいいのよ。')
        return
    } else if (text == 'help') {
        api.slack.talk('helpよ。')
        api.slack.talk('/(甘えんぼ|甘えん坊)/ で甘えんぼさんのリストが見られるわ。')
        patterns.forEach(function(pattern) {
            api.slack.talk(pattern.re.toString() + ' で甘えられるわ。')
        })
        api.slack.talk('みんないっぱい甘えてもいいのよ。')
    } else {
        ikaduti(name, text)
    }
}
