module Main exposing (Model, Msg(..), Status, currentStatusView, decoder, errorView, footerView, handler, init, main, reasonView, reasonsView, statusView, subscriptions, update, view)

import Browser
import Html exposing (Html, br, div, footer, h1, h2, li, text, ul)
import Html.Attributes exposing (class)
import Http
import Json.Decode exposing (bool, field, list, maybe, string, succeed)
import Json.Decode.Pipeline exposing (optional, required, resolve)
import Markdown


type Msg
    = GotResponse Status
    | GotError Http.Error


type alias Model =
    { status : Maybe Status
    , error : Maybe String
    , loading : Bool
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

        GotError error ->
            ( { model | error = Just (Debug.toString error), loading = False }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ div [ class "main" ]
            [ h1 [] [ text "Onko metro rikki?" ]
            , statusView model.status
            , if model.loading == True then
                text "Ladataan statusta..."

              else
                text ""
            , errorView model.error
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


errorView : Maybe String -> Html msg
errorView error =
    case error of
        Just e ->
            text e

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
      }
    , Http.send handler (Http.get "https://onkolansimetrorikki.herokuapp.com/api/isitbroken" decoder)
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
