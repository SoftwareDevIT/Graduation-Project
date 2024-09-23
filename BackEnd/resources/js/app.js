import './bootstrap';
window.Echo.channel('seats')
    .listen('SeatReset', (e) => {
        console.log('Seats reset:', e.seat);
        alert("Seats have been reset: " + e.seat.join(", "));
    });
