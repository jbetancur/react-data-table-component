import * as React from 'react';
import '../DataTable.css';

interface PinnedScrollbarProps {
	scrollRef: React.RefObject<HTMLDivElement>;
	leftInset: number;
	rightInset: number;
}

export default function PinnedScrollbar({
	scrollRef,
	leftInset,
	rightInset,
}: PinnedScrollbarProps): JSX.Element | null {
	const scrollContainerId = React.useId();
	const trackRef = React.useRef<HTMLDivElement>(null);
	const thumbRef = React.useRef<HTMLDivElement>(null);
	const [thumbWidth, setThumbWidth] = React.useState(0);
	const [thumbLeft, setThumbLeft] = React.useState(0);
	const [visible, setVisible] = React.useState(false);
	const [scrollPercent, setScrollPercent] = React.useState(0);
	const isDragging = React.useRef(false);
	const dragStartX = React.useRef(0);
	const dragStartScroll = React.useRef(0);

	const update = React.useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const { scrollWidth, clientWidth, scrollLeft } = el;
		const canScroll = scrollWidth > clientWidth;
		setVisible(canScroll);
		if (!canScroll) return;
		const track = trackRef.current;
		const trackWidth = track?.clientWidth ?? 0;
		if (trackWidth === 0) return;
		const ratio = clientWidth / scrollWidth;
		const tw = Math.max(ratio * trackWidth, 30);
		const maxThumbLeft = trackWidth - tw;
		const maxScroll = scrollWidth - clientWidth;
		setThumbWidth(tw);
		setThumbLeft((scrollLeft / maxScroll) * maxThumbLeft);
		setScrollPercent(maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * 100) : 0);
	}, [scrollRef]);

	// Sync scrollbar when scroll container scrolls or resizes
	React.useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		if (!el.id) el.id = scrollContainerId;
		el.addEventListener('scroll', update, { passive: true });
		const ro = new ResizeObserver(update);
		ro.observe(el);
		update();
		return () => {
			el.removeEventListener('scroll', update);
			ro.disconnect();
		};
	}, [scrollRef, scrollContainerId, update]);

	// Thumb drag
	const handleThumbMouseDown = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			const el = scrollRef.current;
			if (!el) return;
			isDragging.current = true;
			dragStartX.current = e.clientX;
			dragStartScroll.current = el.scrollLeft;

			const onMove = (ev: MouseEvent) => {
				if (!isDragging.current) return;
				const track = trackRef.current;
				if (!el || !track) return;
				const { scrollWidth, clientWidth } = el;
				const trackWidth = track.clientWidth;
				const tw = Math.max((clientWidth / scrollWidth) * trackWidth, 30);
				const maxThumbLeft = trackWidth - tw;
				const maxScroll = scrollWidth - clientWidth;
				const dx = ev.clientX - dragStartX.current;
				const scrollDelta = (dx / maxThumbLeft) * maxScroll;
				el.scrollLeft = Math.max(0, Math.min(maxScroll, dragStartScroll.current + scrollDelta));
			};

			const onUp = () => {
				isDragging.current = false;
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mouseup', onUp);
			};

			window.addEventListener('mousemove', onMove);
			window.addEventListener('mouseup', onUp);
		},
		[scrollRef],
	);

	const handleThumbKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const el = scrollRef.current;
			if (!el) return;
			const step = el.clientWidth * 0.1;
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				el.scrollLeft -= step;
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				el.scrollLeft += step;
			} else if (e.key === 'Home') {
				e.preventDefault();
				el.scrollLeft = 0;
			} else if (e.key === 'End') {
				e.preventDefault();
				el.scrollLeft = el.scrollWidth;
			}
		},
		[scrollRef],
	);

	// Click on track (outside thumb) scrolls by page
	const handleTrackClick = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const thumb = thumbRef.current;
			if (thumb && thumb.contains(e.target as Node)) return;
			const el = scrollRef.current;
			const track = trackRef.current;
			if (!el || !track) return;
			const rect = track.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const { scrollWidth, clientWidth } = el;
			const direction = clickX < thumbLeft ? -1 : 1;
			el.scrollLeft = Math.max(0, Math.min(scrollWidth - clientWidth, el.scrollLeft + direction * clientWidth * 0.8));
		},
		[scrollRef, thumbLeft],
	);

	if (!visible) return null;

	return (
		<div
			className="rdt_pinnedScrollbarTrack"
			ref={trackRef}
			role="presentation"
			style={{ marginLeft: leftInset, marginRight: rightInset }}
			onClick={handleTrackClick}
		>
			<div
				className="rdt_pinnedScrollbarThumb"
				ref={thumbRef}
				role="scrollbar"
				tabIndex={0}
				aria-controls={scrollContainerId}
				aria-orientation="horizontal"
				aria-valuenow={scrollPercent}
				aria-valuemin={0}
				aria-valuemax={100}
				style={{ width: thumbWidth, transform: `translateX(${thumbLeft}px)` }}
				onMouseDown={handleThumbMouseDown}
				onKeyDown={handleThumbKeyDown}
			/>
		</div>
	);
}
