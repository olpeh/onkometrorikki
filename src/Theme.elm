port module Theme exposing (Theme(..), invert, notifyChanged, toClass)

import Json.Encode as JE


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



-- JSON


encode : Theme -> JE.Value
encode theme =
    case theme of
        Light ->
            JE.string "light"

        Dark ->
            JE.string "dark"



-- TO JS


port themePort : JE.Value -> Cmd msg


notifyChanged : Theme -> Cmd msg
notifyChanged theme =
    -- We use complex/JSON values for future-proofing
    let
        themeChangedMsg =
            JE.object
                [ ( "msg", JE.string "ThemeChanged" )
                , ( "data", encode theme )
                ]
    in
    themePort themeChangedMsg
