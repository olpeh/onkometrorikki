module ViewStatusTest exposing (statusFuzzer, suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Main
import Status exposing (Status(..))
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import Time


suite : Test
suite =
    fuzz statusFuzzer "viewStatus should show correct option" <|
        \status ->
            Main.viewStatus status (Time.millisToPosix 0) Time.utc
                |> Query.fromHtml
                |> Query.find [ Selector.tag "h2" ]
                |> Query.has
                    (case status of
                        Working ->
                            [ Selector.text "Ei!" ]

                        Broken reasons ->
                            [ Selector.text "Kyllä!" ]
                    )


brokenStatus : List String -> Status
brokenStatus str =
    Broken
        [ [ { text = Maybe.withDefault "" (List.head str)
            , language = "fi"
            }
          ]
        ]


statusFuzzer : Fuzzer Status
statusFuzzer =
    Fuzz.oneOf
        [ Fuzz.list Fuzz.string
            |> Fuzz.map brokenStatus
        , Fuzz.constant Working
        ]
