module Main exposing (Model, Msg(..), init, main, subscriptions, update, view, viewError, viewFooter, viewReason, viewReasons, viewStatus, viewStatusRequest, viewThemeToggle)

import Browser
import FeatherIcons
import Html exposing (Html, br, button, div, footer, h1, h2, li, span, text, ul)
import Html.A11y exposing (ariaHidden, ariaLabel, ariaPressed)
import Html.Attributes exposing (attribute, class)
import Html.Events exposing (onClick)
import Http
import Markdown
import Status exposing (Status(..), StatusRequest(..))
import Theme exposing (Theme)



-- MODEL


type alias Model =
    { statusRequest : StatusRequest
    , theme : Theme
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { statusRequest = Status.Loading
      , theme = Theme.Light
      }
    , Http.send (Status.requestHandler GotStatus) Status.get
    )



-- MSG


type Msg
    = GotStatus StatusRequest
    | ChangeTheme Theme



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotStatus statusRequest ->
            ( { model | statusRequest = statusRequest }, Cmd.none )

        ChangeTheme newTheme ->
            ( { model | theme = newTheme }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class ("container " ++ Theme.toClass model.theme) ]
        [ div [ class "main" ]
            [ div []
                [ h1 [] [ text "Onko metro rikki?" ]
                , viewStatusRequest model.statusRequest
                ]
            , viewThemeToggle model.theme
            ]
        , footer [] [ viewFooter ]
        ]


viewStatusRequest : StatusRequest -> Html msg
viewStatusRequest statusRequest =
    case statusRequest of
        NotAsked ->
            text ""

        Loading ->
            text "Ladataan statusta..."

        Success status ->
            viewStatus status

        Error error ->
            viewError error


viewStatus : Status -> Html msg
viewStatus status =
    case status of
        Working ->
            h2 [] [ text "Ei!" ]

        Broken reasons ->
            div []
                [ h2 [ class "broken" ] [ text "Kyllä!" ]
                , viewReasons reasons
                ]


viewError : String -> Html msg
viewError error =
    -- TODO: Consider showing the error?
    text "Virhe pyynnön lähettämisessä"


viewReasons : List String -> Html msg
viewReasons reasons =
    -- Handle empty reasons by not adding the ul, semantically.
    -- Could also consider a special case for empty reasons,
    -- such as "Reason not known", and even encode that in the type
    case reasons of
        [] ->
            text ""

        rs ->
            rs
                |> List.map viewReason
                |> ul [ class "reasons" ]


viewReason : String -> Html msg
viewReason reason =
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
        , class "button-reset theme-button"

        -- show the button in the inverted colours
        , class (Theme.toClass inverseTheme)
        , onClick (ChangeTheme inverseTheme)
        ]
        [ FeatherIcons.moon
            |> FeatherIcons.toHtml [ ariaHidden True ]
        ]


viewFooter : Html msg
viewFooter =
    Markdown.toHtml [] """
* Built by [0lpeh](https://twitter.com/0lpeh) |
* Repository available at [GitHub](https://github.com/olpeh/onkometrorikki) |
* Follow [@onkometrorikki](https://twitter.com/onkometrorikki)
"""



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
