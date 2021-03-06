module ViewStatusTest exposing (statusFuzzer, suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Main
import Status exposing (Status(..))
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import Time
import Translations exposing (..)


suite : Test
suite =
    describe "viewStatus"
        [ fuzz statusFuzzer "should show correct status for Finnish" <|
            \status ->
                Main.viewStatus Translations.Finnish status (Time.millisToPosix 0) Time.utc
                    |> Query.fromHtml
                    |> Query.find [ Selector.tag "h2" ]
                    |> Query.has
                        (case status of
                            Working ->
                                [ Selector.text "Ei!" ]

                            Broken reasons ->
                                [ Selector.text "Kyllä!" ]
                        )
        , fuzz statusFuzzer "should show correct status for English" <|
            \status ->
                Main.viewStatus Translations.English status (Time.millisToPosix 0) Time.utc
                    |> Query.fromHtml
                    |> Query.find [ Selector.tag "h2" ]
                    |> Query.has
                        (case status of
                            Working ->
                                [ Selector.text "No!" ]

                            Broken reasons ->
                                [ Selector.text "Yes!" ]
                        )
        , fuzz statusFuzzer "should show correct status for Swedish" <|
            \status ->
                Main.viewStatus Translations.Swedish status (Time.millisToPosix 0) Time.utc
                    |> Query.fromHtml
                    |> Query.find [ Selector.tag "h2" ]
                    |> Query.has
                        (case status of
                            Working ->
                                [ Selector.text "Nej!" ]

                            Broken reasons ->
                                [ Selector.text "Ja!" ]
                        )
        ]


brokenStatus : List String -> Status
brokenStatus str =
    Broken
        [ [ { text = Maybe.withDefault "" (List.head str)
            , language = Translations.Finnish
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
