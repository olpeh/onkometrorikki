module Theme exposing (Theme(..), invert, toClass)


type Theme
    = Light
    | Dark


toClass : Theme -> String
toClass theme =
    case theme of
        Light ->
            "theme-light"

        Dark ->
            "theme-dark"


invert : Theme -> Theme
invert theme =
    case theme of
        Light ->
            Dark

        Dark ->
            Light
