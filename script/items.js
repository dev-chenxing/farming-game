var objectType = {
  seed: 0
};

var items = [
  // 种子
  {
    id: "white_radish",
    name: "白萝卜种子",
    objectType: objectType.seed,
    onActivate: () => {
      var seed = app.inventory.find(item => item.name == "白萝卜种子");
      if (seed.count > 0) {
        var fieldIndex = app.getFieldIndex();
        app.field[fieldIndex] = {
          name: "白萝卜植株",
          onActivate: () => {
            app.field[fieldIndex] = null;
            app.point = app.point.plus(100);
          }
        };
        seed.count -= 1;
      }
    }
  }
];

function getRandomItem() {
  var randItem = items[Math.floor(Math.random() * items.length)];
  return randItem;
}
