module Config exposing (Config)

import Translations


type alias Config =
    { apiBaseUrl : String
    , theme : Maybe String
    , language : Maybe String
    }
