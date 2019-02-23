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
    | ThemeToggleButtonTitleText
    | ErrorNetwork
    | ErrorTimeout
    | ErrorBadUrl
    | ErrorBadStatus
    | ErrorBadPayload


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

        ThemeToggleButtonTitleText ->
            { english = "Toggle between dark and light theme"
            , finnish = "Vaihda teemaa vaalean ja tumman välillä"
            , swedish = "Ändra temat mellan ljus och mörk"
            }

        ErrorNetwork ->
            { english = "No connection, try again later."
            , finnish = "Ei yhteyttä, yritä myöhemmin uudestaan."
            , swedish = "Ingen anslutning, försök pånytt senare."
            }

        ErrorTimeout ->
            { english = "Network timed out."
            , finnish = "Vastaus aikakatkaistiin."
            , swedish = "Svaret tidsavbröts."
            }

        ErrorBadUrl ->
            { english = "It's not you, it's me. I have the server address wrong."
            , finnish = "Vika on minussa. Palvelimen osoite on väärä."
            , swedish = "Det är mitt fel. Serverns adress är felaktig."
            }

        ErrorBadStatus ->
            { english = "The server didn't like the request (bad status)."
            , finnish = "Palvelin ei tykännyt pyynnöstä (virheellinen status)."
            , swedish = "Servern tyckte inte om förfrågan (bad request)."
            }

        ErrorBadPayload ->
            { english = "Ouch, the server responded with strange contents."
            , finnish = "Auts, palvelin vastasi oudolla sisällöllä."
            , swedish = "Aj, servern svarade med något konstigt."
            }
