package def

import "os"

const (

	// Hoge ...
	Hoge = "hoge"
)

// Dev ...
func Dev() bool {

	ret := false

	if os.Getenv("RUN_WITH_DEVAPPSERVER") == "1" {
		ret = true
	}

	return ret
}
