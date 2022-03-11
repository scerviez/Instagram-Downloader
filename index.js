const {
  Telegraf,
  Markup
} = require('telegraf');
const instagram = require("@phaticusthiccy/open-apis");
const bot = new Telegraf(process.env.token);

bot.start(
  (ctx) => ctx.reply(
    "Hi " + ctx.from.username + " This bot can download videos, photos, IGTVs or reels from Instagram. Please send the link to start the download", {
      ...Markup.inlineKeyboard([Markup.button.url('Developer', 't.me/scerviez')])
    }
  )
)

bot.on('text', (ctx) => {
  ctx.reply("Downloading..")
  var link = ctx.message.text
  try {
    if (link.includes("/p/")) {
      instagram.insta_post(link).then(async (data) => {
        url = []
        type = []
        var sp = JSON.stringify(data).split("post")
        var type2 = JSON.stringify(data).split("post")
        var af2 = type2.shift()
        var af = sp.shift()
        type2.map((element2) => {
          type.push(element2.split('"type":"')[1].split('"')[0])
        })
        sp.map((element) => {
          url.push(element.split('"url":"')[1].split('"')[0])
        })
        var n = 0
        url.forEach((send) => {
          if (type[n] == "mp4") {
            ctx.replyWithVideo(send)
          } else {
            ctx.replyWithPhoto(send)
          }
         n = n + 1
        })
      })
    } else if (link.includes("reel")) {
      try {
        instagram.insta_reel(link).then(async (data) => {
          return ctx.replyWithVideo(data.url)
        })
      } catch {
        return ctx.reply("There is a problem with the given link. Check your url. (Profile must be open, not private)")
      }
    } else if (link.includes("tv")) {
      try {
        instagram.insta_post(link).then(async (data) => {
          return ctx.replyWithVideo(data.post1.url)
        })
      } catch {
        return ctx.reply("There is a problem with the given link. Check your url. (Profile must be open, not private)")
      }
    } else {
      return ctx.reply("There is a problem with the given link. Check your url.")
    }
  } catch {
    return ctx.reply("There is a problem with the given link. Check your url. (Profile must be open, not private)")
  }
})
bot.launch()