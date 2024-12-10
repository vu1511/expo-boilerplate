import { Popover, Typography } from '@/components'
import { Colors } from '@/styles'
import { forwardRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const [showPopover, setShowPopover] = useState(false)

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ gap: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
        <Popover
          edgeOffset={8}
          placement="auto"
          visible={showPopover}
          trigger={<Trigger onPress={() => setShowPopover(true)} />}
          onBackdropPress={() => setShowPopover(false)}
        >
          <Content />
        </Popover>
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
