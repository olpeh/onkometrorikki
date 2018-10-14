module Html.A11y exposing (ariaHidden, ariaLabel, ariaPressed, boolToAttr)

import Html exposing (Attribute)
import Html.Attributes exposing (attribute)



{-

   Utilities for well-typed, accessible HTML markup.

-}


{-| Typed, convenient aria-checked attribute
-}
ariaPressed : Bool -> Attribute msg
ariaPressed pressed =
    attribute "aria-pressed" (boolToAttr pressed)


ariaLabel : String -> Attribute msg
ariaLabel =
    attribute "aria-label"


ariaHidden : Bool -> Attribute msg
ariaHidden hidden =
    attribute "aria-hidden" (boolToAttr hidden)


{-| Convert a bool to a boolean attribute value,
e.g. boolToString False == "false"
-}
boolToAttr : Bool -> String
boolToAttr bool =
    case bool of
        True ->
            "true"

        False ->
            "false"
