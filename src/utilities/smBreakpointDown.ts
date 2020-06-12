import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

export default function() {
    const theme = useTheme()
    return useMediaQuery(theme.breakpoints.down('sm'))
}