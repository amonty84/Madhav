interface EdgeConnectorProps {
  fanOut?: boolean
  fanIn?: boolean
}

export function EdgeConnector({ fanOut, fanIn }: EdgeConnectorProps) {
  if (fanOut) {
    return (
      <div className="flex justify-center py-1">
        <div className="w-px h-3 bg-[rgba(212,175,55,0.2)]" />
      </div>
    )
  }
  if (fanIn) {
    return (
      <div className="flex justify-center py-1">
        <div className="w-px h-3 bg-[rgba(212,175,55,0.2)]" />
      </div>
    )
  }
  return (
    <div className="flex justify-center py-1">
      <div className="w-px h-4 bg-[rgba(212,175,55,0.2)]" />
    </div>
  )
}
