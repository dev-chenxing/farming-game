# 遊戲腳本位於此檔案。

init python:
    from game.lib.zhongwen.number import 中文數字

# 遊戲從這裡開始。


label start:

    show text "铜钱" + 中文數字(100) + "文"

    pause

    # 遊戲結束。

    return
