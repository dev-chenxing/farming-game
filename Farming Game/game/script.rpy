# 遊戲腳本位於此檔案。

init python:
    from game.lib.chenxing.int_to_chinese import int_to_chinese

# 遊戲從這裡開始。



label start:

    show text "铜钱" + int_to_chinese(100) + "文"

    pause

    # 遊戲結束。

    return
