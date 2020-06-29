import Menu from './menu.js';
import DebugPanel from './panel.js';
import Particle from "./../floom/particle.js";

/**
 *  ---------------------------- PlotPanel ----------------------------
 */
export default class PlotPanel extends DebugPanel {

    constructor( name, label, timeMachine) {
        super(name, label);

        this.timeMachine = timeMachine;

        this.canvas = $('<canvas />');
        this.container.append( this.canvas );
        this.ctx = this.canvas[0].getContext('2d');

        // this.container.append(this.positionSpan);
        this.lastIndex = this.timeMachine.simulateIndex;

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Determinant',
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                events: [],
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        this.chart.canvas.parentNode.style.height = '200px';

        this.updatePlotData();
    }

    beforeRun() {
        this.updatePlotData();
    }


    updatePlotData(){
        // Note: Will only plot the determinant for now

        if (this.lastIndex === this.timeMachine.simulateIndex) {
            return;
        }
        this.chart.data.labels = [];
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        this.timeMachine.forEachFluidSystem((fluidSystem, index) => {
            let particle = fluidSystem.particles[window.inspectedParticleIndex];
            let determinant = glMatrix.mat2.determinant(particle.deformationGradient);
            this.chart.data.labels.push(index)
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(determinant);
            });
        });

        this.chart.update();


        this.lastIndex = this.timeMachine.simulateIndex;
    }

    afterRun() {

    }
}
/*
$().ready(function() {
});
*/