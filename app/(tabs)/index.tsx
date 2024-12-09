import { Popover, Typography } from '@/components'
import { Colors } from '@/styles'
import { forwardRef, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import RPopover from 'react-native-popover-view'
import { Placement } from 'react-native-popover-view/dist/Types'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const ref = useRef<View>(null)

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ gap: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
        <RPopover popoverStyle={{ height: 300 }} placement={Placement.BOTTOM} offset={0} from={ref}>
          <Content />
        </RPopover>

        {Array.from({ length: 100 }).map((i, index) => (
          <Popover
            key={index}
            placement="top"
            edgeOffset={8}
            // offset={10}
            // arrowSize={0}
            // backgroundStyle={{ backgroundColor: 'transparent' }}
            trigger={<Trigger />}
            // popoverStyle={{ maxHeight: 300 }}
          >
            <Content />
          </Popover>
          // <RPopover key={index} placement={Placement.AUTO} from={<Trigger />}>
          //   <Content />
          // </RPopover>
        ))}
      </View>
    </SafeAreaView>
  )
}

const Content = () => <View style={{ height: 200, width: 288 }} />

const Trigger = forwardRef(({ onPress }: { onPress?: () => void }, ref: any) => (
  <TouchableOpacity
    ref={ref}
    onPress={onPress}
    style={{
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.gray30,
      borderRadius: 8,
      padding: 4,
      overflow: 'hidden',
    }}
  >
    <Typography fontSize={14} fontWeight="400" lineHeight={20}>
      Open
    </Typography>
  </TouchableOpacity>
))
