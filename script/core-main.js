var app = new Vue({
  el: "#app",
  data: {
    logCss: {
      background: "#ffffff",
      height: "300px",
      overflow: "scroll"
    },
    // 读秒器
    timerId: null,
    fpsInterval: 100,
    then: 0,

    secInterval: 1000,
    secThen: 0,
    itemWait: 10,
    groupWait: 30,
    group1Wait: 150,
    group2Wait: 200,

    autosaveSec: 0,

    // 点数
    worldTimes: 0,
    life: new BigNumber(500),
    pastLife: new BigNumber(0),
    group: { exist: false, object: null, name: "散修" },
    group1: { exist: false, object: null, name: "献祭赌博" },
    group2: { exist: false, object: null, name: "信仰神裔" },
    groupInterval: new BigNumber(10),
    groupInterval1: new BigNumber(10),
    groupInterval2: new BigNumber(10),

    point: new BigNumber(0.0),
    pointPerSec: new BigNumber(0.0),

    level: level._0,
    talent: talent._0,
    body: body._0,

    skills: [],
    removeCost: new BigNumber(100),

    itemInterval: new BigNumber(5),
    itemCost: new BigNumber(10000),

    // 显示用
    name: "空",
    born: true,
    world: ["基础"],
    logTxt: [],
    record: "",

    inventory: [],
    fieldSize: 20,
    field: {}
  },
  methods: {
    // utilities
    _reverse: str => {
      return str.split("").reverse().join("");
    },
    _intToChinese: num => {
      var digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var units = ["", "十", "百", "千", "萬", "十", "百", "千", "億", "十", "百", "千", "兆", "十", "百", "千", "京", "十", "百", "千", "垓"];
      var minus = "負";

      var smallUnit = units[1] + units[2] + units[3];
      var bigUnit = units[4] + units[8] + units[12] + units[16] + units[20];
      var zero = digits[0];

      var str = "";
      var n = Math.floor(Math.abs(num));
      if (n < 1) return (num < 0 ? minus : "") + digits[0];
      var uc = units.slice(); // clone the units array
      while (n > 0) {
        var d = n % 10; // 数字
        var u = uc.shift(); // 单位
        str = digits[d] + u + str;
        n = Math.floor(n / 10);
      }
      str = str
        .replace(new RegExp("(" + zero + ")[" + smallUnit + "]", "g"), "$1") // 零千，零百，零十 keeps 零
        .replace(new RegExp("([" + bigUnit + "])[^" + smallUnit + "]+([" + bigUnit + "])", "g"), "$1" + zero) //大數中間沒細數，補零
        .replace(new RegExp("([" + smallUnit + "])" + zero + "+([" + bigUnit + "])", "g"), "$1$2" + zero)
        .replace(new RegExp("(" + digits[0] + ")+", "g"), "$1") // group 零
        .replace(new RegExp(zero + "+$"), ""); // remove trailing zeros
      str = str.replace(new RegExp("^" + digits[1] + units[1]), units[1]); //^一十 == 十
      return (num < 0 ? minus : "") + str;
    },
    // 游戏函数
    getFieldIndex: () => {
      for (const index of Array(app.fieldSize).keys()) {
        if (!app.field[index]) {
          return index;
        }
      }
      confirm("田地不够用啦！");
    },
    // 读秒器
    _startTimer: () => {
      app.then = new Date().getTime();
      app.timerId = window.requestAnimationFrame(app._timer);
    },
    _timer: () => {
      var now = new Date().getTime();
      var elapsed = now - app.then;

      if (elapsed > app.fpsInterval) {
        app.then = now - (elapsed % app.fpsInterval);

        app._countAutoAdd();
      }

      var secElapsed = now - app.secThen;
      if (secElapsed > app.secInterval) {
        app.secThen = now - (secElapsed % app.secInterval);

        app._countPerSec();
      }
      //自动存档，30秒一次
      if (app.autosaveSec > 300) {
        app.autosaveSec = 0;
        app._autoSaveData();
      }
      app.autosaveSec = app.autosaveSec + 1;

      if (app.life.eq(0) || app.life.lessThan(0)) {
        //寿命判断
        app._goEnd();
      } else {
        app.timerId = window.requestAnimationFrame(app._timer);
      }
    },
    _countPerSec: () => {
      app.pastLife = app.pastLife.plus(1);
    },
    // 点数
    _exercise: () => {
      if (app.life.greaterThan(0)) {
        app.point = app.point.plus(app.body.num);
      }
    },
    _countAutoAdd: () => {
      app.point = app.point.plus(app.pointPerSec);

      // 限制处理
      if (app.point.lessThan(0)) {
        app.point = new BigNumber(0);
      }
    },
    _talentLvUp: () => {
      if (!app.point.lessThan(app.talent.need)) {
        app.point = app.point.minus(app.talent.need);
        app.talent = app.talent.getNext();

        app.logTxt.splice(0, 0, "灵根提升！升级为" + app.talent.name + "！");
      }
    },
    _bodyLvUp: () => {
      if (!app.point.lessThan(app.body.need)) {
        app.point = app.point.minus(app.body.need);
        app.body = app.body.getNext();

        app.logTxt.splice(0, 0, "肉体强化！脱胎为" + app.body.name + "！");
      }
    },
    _skillLvUp: i => {
      if (!app.point.lessThan(app.skills[i].object.need)) {
        app.point = app.point.minus(app.skills[i].object.need);
        app.skills[i].object = app.skills[i].object.getNext();

        app.logTxt.splice(0, 0, "潜心修练" + app.skills[i].name + "，功力提升！");
      }
    },
    _getNewSkill: () => {
      if (app.talent.num.greaterThan(app.skills.length) && !app.point.lessThan(app.level.max.div(2))) {
        app.point = app.point.div(app.skills.length + 2).round();

        var randName = randomSkillName();
        app.skills.push({
          name: randName,
          object: getRandomSkill()
        });

        app.logTxt.splice(0, 0, randomNewSkillLog(randName) + "！");
      }
    },
    _getNewItem: () => {
      if (!app.point.lessThan(app.level.max.div(2)) && !app.point.lessThan(app.itemCost)) {
        app.point = app.point.div(10).round();
        app.itemCost = app.itemCost.times(1.1).round();
        app.itemInterval = app.itemInterval.plus(1);
        app.itemWait = app.itemInterval.toNumber();

        var randName = randomItemName();
        var _item = getRandomItem();
        var newItem = {
          name: randName,
          object: _item
        };

        app.logTxt.splice(0, 0, randomNewItemLog(randName) + "！");
        app.items.splice(0, 0, newItem);
      }
    },
    _useItem: id => {
      if (app.items[id].object.useAble) {
        var used = app.items.splice(id, 1)[0];
        used.object.start();
      }
    },
    _removeItems: id => {
      app.items = [];
      app.logTxt.splice(0, 0, "作减求空!果断放弃所有因缘，重新来过");
    },
    _joinGroup: () => {
      if (!app.renown.lessThan(100)) {
        app.renown = app.renown.minus(100);
        app.group = {
          exist: true,
          object: getRandomGroup(),
          name: randomGroupName()
        };
        app.group.object.start();
      }
    },
    //消耗9成寿元
    _joinGroup2: () => {
      if (!app.life.lessThan(1000)) {
        app.life = app.life.div(5).round();
        app.group2 = {
          exist: false,
          object: getRandomGroup2(),
          name: "正义联盟"
        };
        app.group2.object.start();
      }
    },

    _exitGroup: () => {
      app.group.object.end();
      app.group = { exist: false, object: null, name: "散修" };

      app.groupInterval = app.groupInterval.plus(10);
      app.groupInterval1 = app.groupInterval1.plus(10);
      app.groupInterval2 = app.groupInterval2.plus(10);
      app.groupWait = app.groupInterval.toNumber();
      app.groupWait = app.groupInterval1.toNumber();
      app.groupWait = app.groupInterval2.toNumber();
    },
    _exitGroup1: () => {
      app.group1.object.end();
      app.group1 = { exist: false, object: null, name: "散修" };
      app.groupInterval1 = app.groupInterval1.plus(10);
      app.group1Wait = app.groupInterval1.toNumber();
    },
    _exitGroup2: () => {
      app.group2.object.end();
      app.group2 = { exist: false, object: null, name: "散修" };
      app.groupInterval2 = app.groupInterval2.plus(10);
      app.group2Wait = app.groupInterval2.toNumber();
    },
    // 显示用
    _setName: () => {
      app.born = false;
    },
    _showData: () => {
      var data = {};
      data.point = app.point.round().toString();
      data.level = app.level.id;
      data.body = app.body.id;
      data.talent = app.talent.id;

      data.name = app.name;
      data.world = app.world;
      data.worldTimes = app.worldTimes;
      data.life = app.life.toString();
      data.pastLife = app.pastLife.toString();

      data.skills = [];
      for (s of app.skills) {
        data.skills.push({
          name: s.name,
          id: s.object.id
        });
      }

      data.items = [];
      for (i of app.items) {
        data.items.push({
          name: i.name,
          id: items.indexOf(i.object)
        });
      }
      data.itemCost = app.itemCost.toString();
      data.itemInterval = app.itemInterval.toString();
      app.record = LZString.compressToEncodedURIComponent(JSON.stringify(data));
      //手动存档保存在cookie中，缓存三十天
      $.cookie("auto_save", LZString.compressToEncodedURIComponent(JSON.stringify(data)), { expires: 30 });
    },
    _loadData: () => {
      try {
        var record = LZString.decompressFromEncodedURIComponent(app.record);
        if (!record) {
          alert("存档输入错误，请检查内容，如仍然无法读取存档，请加作者Q群进行了解更多。");
          return;
        }

        var data = JSON.parse(record);

        app.point = new BigNumber(data.point);
        app.level = level[data.level];
        app.body = body[data.body];
        app.talent = talent[data.talent];

        app.name = data.name;
        app.world = data.world;
        app.worldTimes = data.worldTimes;
        app.life = new BigNumber(data.life);
        app.pastLife = new BigNumber(data.pastLife);

        app.logTxt = [];

        app.skills = [];
        for (s of data.skills) {
          app.skills.push({
            name: s.name,
            object: skills[s.id]
          });
        }

        app.items = [];
        for (i of data.items) {
          app.items.push({
            name: i.name,
            object: items[i.id]
          });
        }
        app.itemCost = new BigNumber(data.itemCost);
        app.itemInterval = new BigNumber(data.itemInterval);
        app.itemWait = app.itemInterval.toNumber();
      } catch (e) {
        alert(e);
      }
    },
    _addItem: ({ item, count }) => {
      console.log(`_addItem({ itemId: ${item}, count: ${count} })`);
      app.inventory.push({
        object: items.find(i => i.id == item),
        count: count
      });
    },
    _message: ({ message }) => {
      console.log(`_message({ message: ${message} })`);
      app.logTxt.splice(0, 0, message);
    },
    _startscript: () => {
      console.log("_startscript");
      app._addItem({ item: "white_radish", count: 15 });
      app._message({ message: "村长送了你15颗白萝卜种子" });
    },
    _askIfRestart: () => {
      if (confirm("是否重新开始游戏？")) {
        console.log("started a new game");
        $.cookie("auto_save", null);
        window.location.reload(true);
      }
    },
    _autoSaveData: () => {
      //TODO::每分钟自动保存
      var data = {};
      data.point = app.point.round().toString();
      data.level = app.level.id;
      data.body = app.body.id;
      data.talent = app.talent.id;

      data.name = app.name;
      data.world = app.world;
      data.worldTimes = app.worldTimes;
      data.life = app.life.toString();
      data.pastLife = app.pastLife.toString();

      data.skills = [];
      for (s of app.skills) {
        data.skills.push({
          name: s.name,
          id: s.object.id
        });
      }

      data.items = [];
      for (i of app.items) {
        data.items.push({
          name: i.name,
          id: items.indexOf(i.object)
        });
      }
      data.itemCost = app.itemCost.toString();
      data.itemInterval = app.itemInterval.toString();
      //自动存档保存在cookie中，缓存三十天
      $.cookie("auto_save", LZString.compressToEncodedURIComponent(JSON.stringify(data)), { expires: 30 });
      console.log("saved");
    },
    _load: save => {
      try {
        var data = JSON.parse(save);
        app.point = new BigNumber(data.point);
        app.level = level[data.level];
        app.body = body[data.body];
        app.talent = talent[data.talent];

        app.name = data.name;
        app.world = data.world;
        app.worldTimes = data.worldTimes;
        app.life = new BigNumber(data.life);
        app.pastLife = new BigNumber(data.pastLife);

        app.logTxt = [];

        app.skills = [];
        for (s of data.skills) {
          app.skills.push({
            name: s.name,
            object: skills[s.id]
          });
        }

        app.items = [];
        for (i of data.items) {
          app.items.push({
            name: i.name,
            object: items[i.id]
          });
        }
        app.itemCost = new BigNumber(data.itemCost);
        app.itemInterval = new BigNumber(data.itemInterval);
        app.itemWait = app.itemInterval.toNumber();
      } catch (e) {
        alert(e);
      }
    },
    _run: () => {
      // 首次启动时自动检查是否有缓存存档，如果有则读取数据
      var save = LZString.decompressFromEncodedURIComponent($.cookie("auto_save"));
      if (save) {
        app._load(save);
      } else {
        app._startscript();
      }
    },
    _goEnd: () => {
      alert("寿元已尽，请来世再修吧！");
      $.cookie("auto_save", null);
    }
  }
});
app._startTimer();
app._run();
