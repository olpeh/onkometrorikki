module Main exposing (Model, Msg(..), Status, currentStatusView, decoder, errorView, footerView, handler, init, main, reasonView, reasonsView, statusView, subscriptions, update, view)

import Browser
import FeatherIcons
import Html exposing (Html, br, button, div, footer, h1, h2, li, span, text, ul)
import Html.A11y exposing (ariaHidden, ariaLabel, ariaPressed, focusable)
import Html.Attributes exposing (attribute, class)
import Html.Events exposing (onClick)
import Http
import Json.Decode exposing (bool, field, list, maybe, string, succeed)
import Json.Decode.Pipeline exposing (optional, required, resolve)
import Markdown
import Theme exposing (Theme)


type Msg
    = GotResponse Status
    | GotError Http.Error
    | ChangeTheme Theme


type alias Model =
    { status : Maybe Status
    , error : Maybe Http.Error
    , loading : Bool
    , theme : Theme
    }


type alias Status =
    { success : Bool
    , broken : Bool
    , reasons : List String
    , error : Maybe String
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotResponse status ->
            ( { model | status = Just status, loading = False }, Cmd.none )

        GotError e ->
            ( { model | error = Just e, loading = False }, Cmd.none )

        ChangeTheme newTheme ->
            ( { model | theme = newTheme }, Theme.notifyChanged newTheme )


view : Model -> Html Msg
view model =
    div [ class ("container color-fg " ++ Theme.toClass model.theme) ]
        [ div [ class "main" ]
            [ div []
                [ h1 [] [ text "Onko metro rikki?" ]
                , statusView model.status
                , if model.loading == True then
                    text "Ladataan statusta..."

                  else
                    text ""
                , errorView model.error
                ]

            -- You could, in principle, put this in Theme.elm as well...
            , viewThemeToggle model.theme
            ]
        , footer [] [ footerView ]
        ]


statusView : Maybe Status -> Html msg
statusView status =
    case status of
        Just s ->
            currentStatusView s

        Nothing ->
            text ""


currentStatusView : Status -> Html msg
currentStatusView status =
    div []
        [ if status.broken == True then
            h2 [ class "broken" ] [ text "Kyllä!" ]

          else
            h2 [] [ text "Ei!" ]
        , reasonsView status.reasons
        , case status.error of
            Just error ->
                text error

            Nothing ->
                text ""
        ]


errorView : Maybe Http.Error -> Html msg
errorView error =
    case error of
        Just e ->
            text "Virhe pyynnön lähettämisessä"

        Nothing ->
            text ""


reasonsView : List String -> Html msg
reasonsView reasons =
    reasons
        |> List.map reasonView
        |> ul [ class "reasons" ]


reasonView : String -> Html msg
reasonView reason =
    li [] [ text reason ]


{-| The Theme Toggle is a button that communicates whether it is pressed
(as a binary "is dark" state). This simplifies the accessibility roles,
but you would have to change it if you added more themes.
@see <https://inclusive-components.design/a-theme-switcher/>
-}
viewThemeToggle : Theme -> Html Msg
viewThemeToggle theme =
    let
        -- Boolean representation of theme being dark
        isDarkTheme =
            theme == Theme.Dark

        inverseTheme =
            Theme.invert theme
    in
    button
        [ ariaPressed isDarkTheme
        , ariaLabel "Dark mode"
        , class "button-reset theme-button enhanced-outline"

        -- show the button in the inverted colours
        , class (Theme.toClass inverseTheme)
        , onClick (ChangeTheme inverseTheme)
        ]
        [ FeatherIcons.moon
            |> FeatherIcons.toHtml [ ariaHidden True, focusable False ]
        ]


footerView : Html msg
footerView =
    Markdown.toHtml [] """
* Built by [0lpeh](https://twitter.com/0lpeh) |
* Repository available at [GitHub](https://github.com/olpeh/onkometrorikki) |
* Follow [@onkometrorikki](https://twitter.com/onkometrorikki)
"""


init : () -> ( Model, Cmd Msg )
init _ =
    ( { status = Nothing
      , error = Nothing
      , loading = True
      , theme = Theme.Light
      }
    , Http.send handler (Http.get "https://api.onkometrorikki.fi/isitbroken" decoder)
    )


decoder : Json.Decode.Decoder Status
decoder =
    succeed Status
        |> required "success" bool
        |> required "broken" bool
        |> required "reasons" (list string)
        |> optional "error" (maybe string) Nothing


handler : Result Http.Error Status -> Msg
handler result =
    case result of
        Ok status ->
            GotResponse status

        Err error ->
            GotError error


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
