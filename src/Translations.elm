module Translations exposing (Language(..), T, TranslationKey(..), allLanguages, languageToString, stringToLanguage, translate)


type Language
    = Finnish
    | English
    | Swedish


allLanguages : List Language
allLanguages =
    [ Finnish
    , English
    , Swedish
    ]


languageToString : Language -> String
languageToString language =
    case language of
        English ->
            "EN"

        Finnish ->
            "FI"

        Swedish ->
            "SV"


stringToLanguage : String -> Maybe Language
stringToLanguage string =
    case string of
        "EN" ->
            Just English

        "FI" ->
            Just Finnish

        "SV" ->
            Just Swedish

        _ ->
            Nothing


type alias T =
    TranslationKey -> String


type TranslationKey
    = PageTitle
    | BrokenText
    | WorkingText
    | LoadingStatusText
    | RefreshingText
    | DoRefreshText
    | RefreshButtonTitleText
    | LastUpdatedText
    | GeneralErrorMessage
    | ThemeToggleButtonTitleText


type alias TranslationSet =
    { english : String
    , finnish : String
    , swedish : String
    }


translate : Language -> T
translate language translationKey =
    let
        translationSet =
            translationSetFor translationKey
    in
    case language of
        Finnish ->
            translationSet.finnish

        English ->
            translationSet.english

        Swedish ->
            translationSet.swedish


translationSetFor : TranslationKey -> TranslationSet
translationSetFor translationKey =
    case translationKey of
        PageTitle ->
            { english = "Is the metro broken?"
            , finnish = "Onko metro rikki?"
            , swedish = "Är metron sönder?"
            }

        BrokenText ->
            { english = "Yes"
            , finnish = "Kyllä"
            , swedish = "Ja"
            }

        WorkingText ->
            { english = "No"
            , finnish = "Ei"
            , swedish = "Nej"
            }

        LoadingStatusText ->
            { english = "Loading..."
            , finnish = "Ladataan statusta..."
            , swedish = "Laddar..."
            }

        RefreshingText ->
            { english = "Refreshing..."
            , finnish = "Päivitetään..."
            , swedish = "Uppdaterar..."
            }

        DoRefreshText ->
            { english = "Refresh"
            , finnish = "Päivitä"
            , swedish = "Uppdatera"
            }

        RefreshButtonTitleText ->
            { english = "Refresh the status"
            , finnish = "Päivitä tilanne"
            , swedish = "Uppdatera situation"
            }

        LastUpdatedText ->
            { english = "Last updated"
            , finnish = "Viimeksi päivitetty"
            , swedish = "Sist uppdaterad"
            }

        GeneralErrorMessage ->
            { english = "Something went wrong :( Please try again later!"
            , finnish = "Jokin meni pieleen :( Ole hyvä ja yritä myöhemmin uudelleen!"
            , swedish = "Något gick fel :( Vänligen försök igen senare!"
            }

        ThemeToggleButtonTitleText ->
            { english = "Toggle between dark and light theme"
            , finnish = "Vaihda teemaa vaalean ja tumman välillä"
            , swedish = "Ändra temat mellan ljus och mörk"
            }
